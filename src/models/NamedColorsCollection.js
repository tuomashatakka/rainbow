'use babel'
import raise from '../exceptions'

export default class NamedColorsCollection {

  constructor () {
    this.css = new Map()
    this.less = new Map()
    this.scss = new Map()
  }

  register (namespace, color=null) {
    let { prefix, name, assignment } = namespace || {}

    // Register the variable only if the variable is
    // assigned a value in the source
    if (!assignment)
      return

    // Remove the registered variable if the color
    // argument is omitted
    if (this[prefix]) {
      let method = color !== null ? 'set': 'delete'
      this[prefix][method](name, color)
    }
    else
      raise('UNKNOWN_VARIABLE_PREFIX_EXCEPTION')
  }

  clear () {
    this.scss.clear()
    this.less.clear()
    this.css.clear()
  }

}
