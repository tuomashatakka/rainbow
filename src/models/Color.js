'use babel'
import { hue, saturation, brightness, isLight } from '../color-properties'

export default class Color {

  static CLASS_PREFIX = 'raw-color-'

  constructor () {
    let props

    [ this.red, this.green, this.blue, this.alpha, props ] = arguments
    if (isNaN(parseInt(this.red) + parseInt(this.green) + parseInt(this.blue)))
      throw new TypeError(`Invalid arguments passed for the constructor of Color. Use Color.from to parse a color from a hex color string.`)
    this.alpha = isNaN(this.alpha) ? 255 : parseInt(this.alpha)

    this.meta = new Map()
    if (props)
      this.updateMeta(props)
  }

  updateMeta (meta={}) {
    Object
      .keys(meta)
      .forEach(key => this.meta.set(key, meta[key]))
  }

  get palette () {
    return this.meta.get('palette') || null
  }

  get name () {
    let { palette } = this
    if (palette)
      return this.palette.getNameForColor(this)
    return ''
  }

  static hex (color, meta={}) {

    let r, g, b, a

    if (color.length < 6) {
      r = parseInt(color.substr(1, 1), 16) * 16
      g = parseInt(color.substr(2, 1), 16) * 16
      b = parseInt(color.substr(3, 1), 16) * 16
      a = parseInt(color.substr(4, 1), 16) * 16
    }
    else {
      r = parseInt(color.substr(1, 2), 16)
      g = parseInt(color.substr(3, 2), 16)
      b = parseInt(color.substr(5, 2), 16)
      a = parseInt(color.substr(7, 2), 16)
    }

    // Normalize the alpha values
    a = isNaN(a) ? 255 : parseInt(a * 255)

    meta.originalFormat = 'hex'
    return new Color(r, g, b, a, meta, meta={})
  }

  static rgb (color, meta={}) {

    let [ r, g, b, a ] = color

    // Normalize the alpha values
    a = a ? parseInt(a * 255) : 255
    meta.originalFormat = 'rgb'
    return new Color(r, g, b, a, meta)
  }

  static from () {
    let type, props = {}
    let last = arguments[arguments.length - 1]

    let color = (arguments.length < 3)
      ? arguments[0]
      : Array.from(arguments)

    if (color instanceof Color || color && color[0] instanceof Color)
      return color
    if (typeof last === 'object')
      props = last

    if (color[0] === '#')
      type = 'hex'
    else if ([3, 4].indexOf(color.length) > -1)
      type = 'rgb'
    if (!type || !Color[type])
      throw new TypeError(`Invalid input for Color.from. The function accepts either a hex color value or a list of integers with a length of 3 or 4. Got ${color}`)

    return Color[type](color, props)
  }

  static equal (c1, c2) {
    let rgba1 = c1 && c1.rgba
    let rgba2 = c2 && c2.rgba
    return c1 && rgba1 == rgba2
  }

  is (color) {
    return Color.equal(this, color)
  }

  get components () {
    return [
      this.red,
      this.green,
      this.blue,
      this.alpha / 255
    ]
  }

  get channels () {
    return [ this.red, this.green, this.blue ]
  }

  get hex () {
    return this.toHex()
  }

  get rgb () {
    return this.toRGB()
  }

  get rgba () {
    return this.toRGBA()
  }

  get hsl () {
    // TODO
    return this.toRGB()
  }

  get hue () {
    return hue(this)
  }

  get saturation () {
    return saturation(this)
  }

  get brightness () {
    return brightness(this)
  }

  getIdentifier () {
    return Color.CLASS_PREFIX + this.hex.substr(1) + parseInt(this.alpha).toString(16)
  }

  isLight () {
    return isLight(this)
  }

  isDark () {
    return !this.isLight()
  }

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
    return '#' + this.channels.map(toHex).join('')
  }

  toRGB () {
    return `rgb(${this.red}, ${this.green}, ${this.blue})`
  }

  toRGBA () {
    let s = this.components.join(', ')
    return `rgba(${s})`
  }

  toCSS () {
    let className = '.' + this.getIdentifier()
    let color     = this.toString()
    return `
      ${className} { --color: ${color}; }`
  }
}
