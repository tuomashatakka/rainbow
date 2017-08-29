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
    let colorName       = color.name

    this.style.setProperty('color', textColor)
    this.style.setProperty('background', backgroundColor)
    this.innerHTML = `
      <div class='content'>
        <h4 class='name'>${colorName ? colorName + '<br>' : ''}</h4>
        <code class='value'>${color.hex}<br></code>
        <div class='details'>
          H${color.hue}<br>
          S${color.saturation}<br>
          L${color.brightness}
        </div>
      </div>
    `
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
