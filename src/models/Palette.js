'use babel'
import Color from './Color'
import NamedColorsCollection from './NamedColorsCollection'
import { matchColors } from '../parser'
import Emitter from 'events'
import self from 'autobind-decorator'

export default class Palette extends Emitter {

  constructor () {
    super()

    this.swatches    = new Set()
    this.namedColors = new NamedColorsCollection()
  }

  get colors () {
    return [ ...this.swatches  ]
  }

  get names () {
    return Object.keys(this.namedColors).reduce(
      (arr, ln) => [ ...arr, ...this.namedColors[ln].keys() ], [])
  }

  @self
  async findColors (text) {
    let colors = await matchColors(text)
    return this.cleanColors(colors)
  }

  cleanColors (colors=[]) {
    this.clear()
    return colors.map(this.addColor.bind(this))
  }

  clear () {
    this.swatches.clear()
    this.namedColors.clear()
  }

  @self
  addColor ({ color, name: ns = {}, meta={} }) {
    color         = Color.from(color)
    color.palette = this
    Object.keys(meta).forEach(key =>
      color.meta.set(key, meta[key]))

    this.swatches.add(color)
    this.namedColors.register(ns, color)
    console.log("added color", color, this.swatches)
    return color
  }

  @self
  hasColorWithName (name) {
    return this.names.indexOf(name) > -1
  }

  /**
   * @method getNameForColor
   * @param  options {
   *           all: false
   *         }
   */

  @self
  getColorByName (name, options={}) {
    if (!this.hasColorWithName(name))
      return null
    let results = {}
    for (let ln in this.namedColors) {

      results[ln] = options.all ? [] : null
      let iter = this.namedColors[ln].entries()
      let current = {}

      while(!current.done) {
        current = iter.next()
        if (current.done)
          break

        let [ key, value ] = current.value
        if (key === name) {
          if (!options.all) {
            results[ln] = value
            break
          }
          results[ln].push(value)
        }
      }
    }
    return results
  }

  @self
  getNameForColor (color, options={}) {
    let results = {}
    color = Color.from(color)

    for (let ln in this.namedColors) {

      results[ln] = options.all ? [] : null
      let iter = this.namedColors[ln].entries()
      let current = {}

      while(!current.done) {
        current = iter.next()
        if (current.done)
          break

        let [ key, value ] = current.value
        if (Color.equal(value, color)) {
          if (!options.all) {
            results[ln] = key
            break
          }
          results[ln].push(key)
        }
      }
    }
    return results
  }

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
