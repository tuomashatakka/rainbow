
const { PI, floor: round } = Math
const R = 2 * PI

const coefficient = {
  red:    0.2127,
  green:  0.7152,
  blue:   0.0722,
}
const coefficients = [
  coefficient.red,
  coefficient.green,
  coefficient.blue,
]

// Ƹ
// ǝ
// Β
// Δ
// Ε
// Ζ
// Η
function resolve (Ʃ) {

  function pureBrightness ({ channels }) {
    let total = channels.reduce((val, c) => val + c, 0)
    return parseInt(total / channels.length)
  }

  function brightness ({ channels }) {
    let v = 0
    for (let col in channels) {
      let d = channels[col] / 255
      v += coefficients[col] * (d < 0.03928 ? d / 12.92 : Math.pow(((d + 0.055) / 1.055), 2.4))
    }
    return parseInt(v * 255)
  }

  function relativeBrightness (color, channel=null) {
    let bri      = brightness(color)
    let relative = color.channels.map(val => val - bri)
    return channel ? relative[channel] : relative
  }

  function luminance ({ channels }) {
    // TODO: How is this calculated?
    console.info(relativeBrightness({channels}))
  }


  function saturation (color) {
    let { x, y } = rotation(color)
    let distance = Math.sqrt(x * x + y * y)
    return parseInt(distance * 255)
  }

  function hue (color, format='deg') {
    let { x, y } = rotation(color)
    let rot      = (Math.atan2(y, x) + R) % R
    if (format === 'deg')
      return radiansToDegrees(rot)
    if (format === 'rad')
      return rot
    throw new TypeError('Format must be either `deg` or `rad` for the hue function')
  }


  function isLight (color) {
    return brightness(color) > 127
  }

  function isDark (color) {
    return !isLight(color)
  }


  function radiansToDegrees (rad) {
    return round(180 * rad / PI)
  }

  function hueComponents (color) {
    return {
      [0 / 3 * Math.PI]: color.red / 255,
      [2 / 3 * Math.PI]: color.green / 255,
      [4 / 3 * Math.PI]: color.blue / 255,
    }
  }

  function rotation (color) {
    let chs = hueComponents(color)
    let y = 0, x = 0
    for (let rot in chs) {
      let dy = Math.sin(rot) * chs[rot]
      let dx = Math.cos(rot) * chs[rot]
      x += dx
      y += dy
    }
    return { x, y }
  }


  Object.assign(Ʃ, {
    brightness, isLight, isDark,
    hue,
    saturation,
    luminance,
  })
}

resolve(window)
