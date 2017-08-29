'use babel'

// Matchers
export const match = {
  variable: /(?:(?:\(|\s|\n)(@|\$|--))(?:(\w[\w-_]*)\s*)(?:(:)\s*)?/g,
  prefix:   /(#|(?:rgb|hsl)a?)/g,
  colors: {
    hex: /(?:[\dabcdef]{6}|[\dabcdef]{8}|[\dabcdef]{3,4})(?:[^\w\d])/ig,
    rgb: /(?:\s+)?\(((?:\s*[\d.]{1,}\s*,?)+)\s*\)/ig,
  },
}

export const VARIABLE_PREFIX = {
  '@': 'less',
  '$': 'scss',
  '--': 'css',
}

export const URI_NAMESPACE = 'rainbow://'
