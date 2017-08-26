
const fixture = window.fileContents

// Matchers
const matchPrefix    = /(#|(?:rgb|hsl)a?)/g
const matchHexColors = /(?:[\dabcdef]{6}|[\dabcdef]{8}|[\dabcdef]{3,4})/ig
const matchRgbColors = /\s*\(((?:\s*[\d.]{1,3}\s*,?)+)\s*\)/ig
const matchAnyColors = combine(matchHexColors, matchRgbColors)


function combine (...re) {
  let pre = matchPrefix.source
  let source = re.map(item => item.source || item).join('|')
  return new RegExp(pre + '(' + source + ')', 'ig')
}

function parseColor (type, val) {
  const { min, max } = Math
  const limit = (val, isAlpha) => isAlpha
    ? max(min(1, parseFloat(val)), 0)
    : max(min(255, parseInt(val)), 0)
  if (type === '#')
    return '#' + val
  return val
    .split(',')
    .map((component, n) => limit(component.trim(), n === 3))
}

async function matchColors (text) {
  let colors = []
  text.replace(
    matchAnyColors,
    (_, type, hex, rgb) => colors.push(parseColor(type, rgb || hex)))
  return colors
}

function orderBy (colors, param='hue') {
  return colors.sort((c1, c2) => c1[param] > c2[param] ? 1 : c1[param] < c2[param] ? -1 : 0)
}


class Color {

  constructor () {
    let authoredType

    [ authoredType, this.red, this.green, this.blue, this.alpha ] = arguments
    this.meta = new Map()
    this.meta.set('originalFormat', authoredType)
  }

  static hex (color) {

    let r, g, b, a

    if (color.length < 6) {
      r = parseInt(color.substr(1, 1), 16)
      g = parseInt(color.substr(2, 1), 16)
      b = parseInt(color.substr(3, 1), 16)
      a = parseInt(color.substr(4, 1), 16)
    }
    else {
      r = parseInt(color.substr(1, 2), 16)
      g = parseInt(color.substr(3, 2), 16)
      b = parseInt(color.substr(5, 2), 16)
      a = parseInt(color.substr(7, 2), 16)
    }

    // Normalize the alpha values
    a = isNaN(a) ? 255 : parseInt(a * 255)

    return new Color('hex', r, g, b, a)
  }

  static rgb (color) {

    let [ r, g, b, a ] = color

    // Normalize the alpha values
    a = a ? parseInt(a * 255) : 255
    return new Color('rgb', r, g, b, a)
  }

  static resolve (...color) {
    let type

    if (color.length === 1)
      color = color[0]

    if (color[0] === '#')
      type = 'hex'

    else if ([3, 4].indexOf(color.length) > -1)
      type = 'rgb'

    return Color[type](color)
  }

  get components () {
    return [
      this.red,
      this.green,
      this.blue,
      this.alpha
    ]
  }

  get channels () {
    return [ this.red, this.green, this.blue ]
  }

  get hex () { return this.toHex() }
  get rgb () { return this.toRGB() }
  get rgba () { return this.toRGBA() }
  get hsl () { return this.toRGB() }

  get hue () { return hue(this) }
  get saturation () { return saturation(this) }
  get brightness () { return brightness(this) }

  toString () {
    return this.toRGBA()
  }

  toJSON () {
    let { red, green, blue, alpha } = this
    return { red, green,blue, alpha }
  }

  toHex () {
    const toHex = c => {
      c = c.toString(16)
      while (c.length < 2)
        c = '0' + c
      return c
    }
    let s = this.components.slice(0, 3)
    return '#' + s.map(toHex).join('')
  }

  toRGB () {
    return `rgb(${this.red}, ${this.green}, ${this.blue})`
  }

  toRGBA () {
    let s = this.components.join(', ')
    return `rgba(${s})`
  }
}

class Palette {
  constructor () {
    this.colorSet = new Set()
  }

  get colors () { return [ ...this.colorSet  ]}

  async findColors (text) {
    let colors = await matchColors(text)
    return colors.map(this.addColor.bind(this))
  }

  addColor (color) {
    color = Color.resolve(color)
    this.colorSet.add(color)
    return color
  }

  toJSON () {
    let { colors } = this
    return { colors }
  }

  toString () {
    return this
      .colors
      .map(c => c.toString())
      .join(', ')
  }

}

class RainbowSwatch extends HTMLElement {
  connectedCallback () {
    const { color } = this
    const textColor =  window.isLight(color) ? 'black' : 'white'

    this.innerHTML = `H${color.hue}<br/>S${color.saturation}<br/>L${color.brightness}`
    this.style.setProperty('background', color.toString())
    this.style.setProperty('color', textColor)
  }
}

class RainbowPanel extends HTMLElement {

  constructor () {
    super()
    this.palette = new Palette()
    this.palette
      .findColors(fixture)
      .then(this.appendColors.bind(this))
  }

  appendColors (colors) {

    colors = orderBy(colors)
    for (let color of colors) {

      let el  = document.createElement('rainbow-swatch')
      el.color = color

      this.append(el)
    }
  }

  connectedCallback () {
    // this.innerHTML = this.palette.toString()
  }

}

function defineElements () {
  customElements.define('rainbow-swatch', RainbowSwatch)
  customElements.define('rainbow-panel',  RainbowPanel)
}

function init () {
  defineElements()
  let panel = document.createElement('rainbow-panel')
  openPanel(panel)
}

function openPanel (item) {
  document.body.append(item)
}

init()
