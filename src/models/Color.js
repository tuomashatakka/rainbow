'use babel'
import { hue, saturation, brightness, isLight } from '../color-properties'

export default class Color {

  static CLASS_PREFIX = 'raw-color-'

  constructor () {
    let authoredType

    [ authoredType, this.red, this.green, this.blue, this.alpha ] = arguments
    if (isNaN(parseInt(this.red) + parseInt(this.green) + parseInt(this.blue)))
      throw new TypeError(`Invalid arguments passed for the constructor of Color. Use Color.from to parse a color from a hex color string.`)
    this.alpha = isNaN(this.alpha) ? 255 : parseInt(this.alpha)

    this.meta = new Map()
    this.meta.set('originalFormat', authoredType)
  }

  static hex (color) {

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

    return new Color('hex', r, g, b, a)
  }

  static rgb (color) {

    let [ r, g, b, a ] = color

    // Normalize the alpha values
    a = a ? parseInt(a * 255) : 255
    return new Color('rgb', r, g, b, a)
  }

  static from (...color) {
    let type

    if (color.length === 1)
      color = color[0]

    if (color instanceof Color)
      return color

    if (color[0] === '#')
      type = 'hex'

    else if ([3, 4].indexOf(color.length) > -1)
      type = 'rgb'

    if (!type || !Color[type])
    throw new TypeError(`Invalid input for Color.from. The function accepts either a hex color value or a list of integers with a length of 3 or 4.`)

    return Color[type](color)
  }

  static equal (c1, c2) {
    return (
      c1 && c1.rgba &&
      c2 && c2.rgba &&
      c1.rgba === c2.rgba)
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

  get hex () { return this.toHex() }
  get rgb () { return this.toRGB() }
  get rgba () { return this.toRGBA() }
  get hsl () { return this.toRGB() }

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
    return Color.CLASS_PREFIX + this.hex.substr(1) + parseInt(this.alpha)
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
