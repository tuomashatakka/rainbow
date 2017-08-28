'use babel'
import PaletteView from './PaletteView'
import { dom } from 'edm'
const { make: element } = dom

export default class Panel {
  static URI = 'rainbow://palette/swatch-panel'

  constructor () {
    this.item = createView.call(this)
  }
  getElement () {
    return this.item
  }
  getTitle () {
    return 'eeli the anaali-paneeli'
  }
  getDefaultLocation() {
    return 'right'
  }
  getAllowedLocations() {
    return ['center', 'bottom', 'top', 'right', 'left']
  }
  getURI() {
    return Panel.URI
  }
  destroy () {
    if (this.item)
      this.item.remove()
  }
}

function createView () {

  let title   = element({ type: 'h3', content: this.getTitle() })
  let palette = element({ type: PaletteView.tag })

  let header  = element({
    tag:      'header',
    class:    'panel-header',
    content:  [ title ] })

  let container = element({
    tag:      'div',
    class:    'rainbow-panel tool-panel padded',
    content:  [ header, palette ] })

  this.paletteView = palette
  return container
}
