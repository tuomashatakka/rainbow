'use babel'
import self from 'autobind-decorator'
import raise from '../exceptions'

export default class NamedColorsCollection {

  constructor () {
    this.css  = new Map()
    this.less = new Map()
    this.scss = new Map()
    this.swatchNames = new WeakMap()
  }

  register (namespace, color=null) {
    let { prefix, name, assignment } = namespace || {}

    // Register the variable only if the variable is
    // assigned a value in the source
    if (!assignment)
      return

    // Remove the registered variable if the color
    // argument is omitted
    if (!this[prefix])
      raise('UNKNOWN_VARIABLE_PREFIX_EXCEPTION')

    let method = color !== null ? 'set': 'delete'
    this[prefix][method](name, color)

    let names = this.swatchNames.get(color) || []
    this.swatchNames.set(color, [ ...names, name ])
  }

  get groupNames () {
    return [ 'css', 'less', 'scss' ]
  }

  get names () {
    const reducer = (arr, group) => [ ...arr, ...this[group].keys() ]
    return this.groupNames.reduce(reducer, [])
  }

  @self
  hasColorWithName (name) {
    return this.names.indexOf(name) > -1
  }

  @self
  getNameForColor (color) {
    return this.swatchNames.get(color)
  }

  /**
   * @method getColorByName
   * @param  options {
   *           all: false
   *         }
   */

  @self
  getColorByName (name, options={}) {
    if (!this.hasColorWithName(name))
      return null

    const results = {}
    const resolve = (color, group) => {
      if (!options.all)
        return color
      results[group] = results[group] || []
      results[group].push(color)
    }

    for (let group of this.groupNames) {

      let entries = this[group].entries()
      for (let [ key, color ] of entries) {

        if (key === name)
          resolve(color, group)
      }
    }
    return results
  }

  forGroup (fn) {
    for (let group of this.groupNames) {
      fn(this[group])
    }
  }

  clear () {
    this.forGroup(group => group.clear())
  }

}
