'use babel'
import { match } from './definitions'

export function orderBy (colors, param='hue') {
  return colors.sort((c1, c2) => c1[param] > c2[param] ? 1 : c1[param] < c2[param] ? -1 : 0)
}

export function combine (...re) {
  let pre    = match.prefix.source
  let vari   = match.variable.source
  let source = re.map(item => item.source || item).join('|')
  return new RegExp(`(?:${vari})?${pre}(${source})`, 'ig')
}

export function defineElements (elements={}) {
  const output   = []
  for (let tagName in elements) {
    let viewClass = elements[tagName]
    console.log("defining element", tagName, viewClass)

    try {
      // let element =
      customElements.define(tagName, viewClass)
      console.log("defined element", tagName, 'with a great success')
      // output.push(element)
    }

    catch (e) {
      output.push(new Error(e))
      // output.push(customElements.get(tagName))
    }
  }
  return output
}

export function notifyOnDebug (message, level='info') {
  if (atom.devMode)
    atom.notifications.add(level, message)
}
