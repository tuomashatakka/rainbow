const { CompositeDisposable } = require('atom')

class SwatchView extends HTMLElement {

  constructor () {
    super()
    this.subscriptions = new CompositeDisposable()
  }

  connectedCallback () {
    const { color }       = this
    const textColor       = color.isLight() ? 'black' : 'white'
    const backgroundColor = color.toString()

    this.style.setProperty('color', textColor)
    this.style.setProperty('background', backgroundColor)
    this.innerHTML = `H${color.hue}<br/>S${color.saturation}<br/>L${color.brightness}`
  }

  onDidClick (handler) {
    const eventName = 'click'
    const callback  = (e) => handler.call(this, e)
    const unbind    = () => this.removeEventListener(eventName, callback)
    const bind      = () => this.addEventListener(eventName, callback)

    this.subscriptions.add(unbind)
    bind()
  }

}

SwatchView.tag = 'rainbow-swatch'
module.exports = SwatchView
