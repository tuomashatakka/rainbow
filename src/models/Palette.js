'use babel'
import Color from './Color'
import NamedColorsCollection from './NamedColorsCollection'
import { matchColors } from '../parser'
import { sortBy } from '../utils'
import Emitter from 'events'
import { CompositeDisposable, Disposable } from 'atom' // TODO: from event-kit
import self from 'autobind-decorator'

const ADD_COLOR = 'did-add-color'
const REMOVE_COLOR = 'did-remove-color'
const UPDATE_COLOR = 'did-update-color-meta'

export default class Palette extends Emitter {

  constructor () {
    super()

    // FIXME: Remove this asignment
    window.palette     = this

    this.swatches      = new Set()
    this.namedColors   = new NamedColorsCollection()
    this.subscriptions = new CompositeDisposable()
  }

  get colors () {
    return [ ...this.swatches ]
  }

  get names () {
    return Object.keys(this.namedColors).reduce(
      (arr, ln) => [ ...arr, ...this.namedColors[ln].keys() ], [])
  }

  getNameForColor (color) {
    let names = this.namedColors.getNameForColor(color) || []
    if (names.length)
      return names[0]
    return ''
  }

  getColorByName (name) {
    return this.namedColors.getColorByName(name)
  }

  @self
  async findColors (text, meta={}) {
    let colors = await matchColors(text)
    return this.addColors(colors, meta)
  }

  cleanColors (colors=[]) {
    this.clear()
    return colors.map(this.addColor.bind(this))
  }

  clear () {
    let { colors } = this
    this.swatches.clear()
    this.namedColors.clear()
    this.emit(REMOVE_COLOR, colors)
  }

  @self
  hasColor (color) {
    for (let comparedColor of this.colors) {
      if (Color.equal(color, comparedColor))
        return true
    }
    return false
  }

  @self
  getColor (colorOrName) {

    if (typeof colorOrName === 'string') {
      let namedColor = this.getColorByName(colorOrName)
      if (namedColor)
        return namedColor
    }

    colorOrName = Color.from(colorOrName)
    for (let color of this.swatches) {
      if (color.is(colorOrName))
        return color
    }
    return null
  }

  @self
  updateColor (color, meta={}) {
    this
      .getColor(color)
      .updateMeta(meta)
    this.emit(UPDATE_COLOR, color)
  }

  @self
  addColor ({ color, name: ns = {}, meta={} }) {
    meta.palette = this
    color = Color.from(color, meta)
    color.updateMeta(meta)

    if (!this.hasColor(color)) {
      this.swatches.add(color)
      this.namedColors.register(ns, color)
      this.emit(ADD_COLOR, color)
      return color
    }
    else  {
      this.updateColor(color, meta)
      return null
    }
  }

  @self
  addColors (colors, meta={}) {
    let created = []
    for (let color of colors) {
      Object.assign(color.meta, meta)
      color = this.addColor(color)
      if (color)
        created.push(color)
    }
    return created
  }

  @self
  filterColors (...filters) {
    let { colors } = this
    for (let filter of filters) {
      colors = colors.filter(filter)
    }
    return colors
  }

  @self
  removeColors (colors) {
    for (let color of colors) {
      if (this.hasColor(color)) {
        this.swatches.delete(color)
        this.emit(REMOVE_COLOR, colors)
      }
    }

  }

  @self
  sort (by) {
    let sorted = sortBy(this.colors, by)
    this.swatches.clear()
    this.addColors(sorted)
  }

  @self
  getColorsWithMeta (name, value) {
    let filter = !value ?
      (color => color.meta.has(name)) :
      (color => color.meta.get(name) == value)
    return this.filterColors(filter)
  }

  onDidAddColor (callback, instant=false) { this.subscribe(ADD_COLOR, callback, instant) }
  onDidRemoveColor (callback, instant=false) { this.subscribe(REMOVE_COLOR, callback, instant) }
  onDidUpdateColor (callback, instant=false) { this.subscribe(UPDATE_COLOR, callback, instant) }
  subscribe (eventName, callback, instant) {
    callback       = callback.bind(this)
    let unbind     = () => this.removeListener(eventName, callback)
    let disposable = new Disposable(unbind)
    this.on(eventName, callback)
    this.subscriptions.add(disposable)
    if (instant) callback(this)
  }

  destroy () { this.subscriptions.dispose() }

  toJSON () {
    let colors = this.colors.map(color => color.toJSON())
    let names  = this.names
    return {
      colors,
      names,
    }
  }

  toString () {
    return this
      .colors
      .map(c => c.toString())
      .join(', ')
  }

  toCSS () {
    return this.colors.reduce((css, col) => css + col.toCSS(), '')
  }

}
