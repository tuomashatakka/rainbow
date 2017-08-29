const { CompositeDisposable, Disposable } = require('atom')
const { findSwatchElement, isSwatch } = require('../utils')
const Color = require('../models/Color')

class PaletteView extends HTMLElement {

  constructor () {
    super()
    this.subscriptions = new CompositeDisposable()
  }

  async applyColorsFromSource (palette, source) {
    let colors   = await palette.findColors(source)
    let children = await this.appendColors(colors)
    return children
  }

  clearColors () {
    // Clear the existing colors
    [ ...this.children ].forEach(color => color.remove())
    console.warn("Colors cleared")
  }

  clearSelection () {
    this.iterateColors(c => c.classList.remove('selected'))
  }

  selectColor (color) {
    this.clearSelection()
    if (!color)
      return null
    this
      .getSwatchElementFor(color)
      .setAttribute('class', 'selected')
  }

  getSwatchElementFor (color) {
    const { children } = this
    const reducer = (match, child) => !match && child.color.is(color) ? child : match
    return Array
      .from(children)
      .reduce(reducer, null)
  }

  get selectedElements () {
    return Array.from(this.querySelector('.selected'))
  }

  get selectedColors () {
    return this.selectedElements.map(item => item.color)
  }

  iterateColors (fn) {
    return Array.from(this.children).map(fn)
  }

  async removeColors (colors) {
    const search = color => colors.find(comparedColor => color.is(comparedColor))
    this.iterateColors(child => {
      if (search(child.color))
        child.remove()
    })
    console.warn("Colors removed:", colors)
  }

  async appendColors (colors) {
    // Order the colors in the current palette
    // and append them as this element's children
    // colors = this.palette.cleanColors(orderBy(colors))

    for (let color of colors) {
      let swatch  = createSwatch(color)
      this.append(swatch)
    }
    console.warn("Colors added:", colors)
    return this.children
  }

  onDidClickColor (handler) {
    const eventName = 'click'
    const unbind    = () => this.removeEventListener(eventName, callback)
    const bind      = () => this.addEventListener(eventName, callback)
    const callback  = (e) => {
      let el = findSwatchElement(e)
      if (isSwatch(el))
        handler.call(this, el.color, el)
    }
    this.subscriptions.add(new Disposable(unbind))
    bind()
  }

  onDidDoubleClickColor (handler) {
    const eventName = 'dblclick'
    const unbind    = () => this.removeEventListener(eventName, callback)
    const bind      = () => this.addEventListener(eventName, callback)
    const callback  = (e) => {
      let el = findSwatchElement(e)
      if (isSwatch(el))
        handler.call(this, el.color, el)
    }
    this.subscriptions.add(new Disposable(unbind))
    bind()
  }

  connectedCallback () {
    this.applyColorsFromSource = this.applyColorsFromSource.bind(this)
    this.getSwatchElementFor   = this.getSwatchElementFor.bind(this)
    this.appendColors          = this.appendColors.bind(this)
    this.selectColor           = this.selectColor.bind(this)
  }

  destroy () {
    this.subscriptions.dispose()
  }

}


function createSwatch (color) {
  let el = document.createElement('rainbow-swatch')
  el.color = color
  return el
}


PaletteView.tag = 'rainbow-palette'
module.exports = PaletteView
