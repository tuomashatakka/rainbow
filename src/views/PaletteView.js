const { CompositeDisposable, Disposable } = require('atom')
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
  }

  clearSelection () {
    this.iterateColors(c => c.removeAttribute('class'))
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
    const search = color => colors.find(comparedColor => Color.equal(comparedColor, color)) !== null
    this.iterateColors(child => {
      if (search(child.color))
        child.remove()
    })
  }

  async appendColors (colors) {
    // Order the colors in the current palette
    // and append them as this element's children
    // colors = this.palette.cleanColors(orderBy(colors))

    for (let color of colors) {
      let swatch  = createSwatch(color)
      this.append(swatch)
    }
    return this.children
  }

  onDidClickColor (handler) {
    const eventName = 'click'
    const isSwatch  = el => el.tagName === 'RAINBOW-SWATCH'
    const unbind    = () => this.removeEventListener(eventName, callback)
    const bind      = () => this.addEventListener(eventName, callback)
    const callback  = (e) => {
      let el
      let { path } = e
      while (path.length) {
        el = path.shift()
        if (isSwatch(el))
          break
      }
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
