const { CompositeDisposable } = require('atom')
const { orderBy } = require('../utils')
const Palette = require('../models/Palette')

class PaletteView extends HTMLElement {

  constructor () {
    super()
    this.palette       = new Palette()
    this.subscriptions = new CompositeDisposable()
  }

  async applyColorsFromSource (source) {
    let colors   = await this.palette.findColors(source)
    let children = await this.appendColors(colors)
    return children
  }

  clear () {
    // Clear the existing colors
    [ ...this.children ].forEach(color => color.remove())
    this.palette.cleanColors()
  }

  async setColors (colors) {
    this.clear()
    return await this.appendColors(colors)
  }

  async appendColors (colors) {
    // Order the colors in the current palette
    // and append them as this element's children
    colors = this.palette.cleanColors(orderBy(colors))

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
      let { path } = e
      let el
      while (path.length) {
        el = path.shift()
        if (isSwatch(el))
          break
      }
      if (isSwatch(el))
        handler.call(this, el.color)
    }

    this.subscriptions.add(unbind)
    bind()
  }

  connectedCallback () {
    this.applyColorsFromSource = this.applyColorsFromSource.bind(this)
    this.appendColors          = this.appendColors.bind(this)
  }

}

function createSwatch (color) {
  let el = document.createElement('rainbow-swatch')
  el.color = color
  return el
}

PaletteView.tag = 'rainbow-palette'
module.exports = PaletteView
