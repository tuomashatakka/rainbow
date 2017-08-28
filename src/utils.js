'use babel'
import { match } from './definitions'
import { TextEditor } from 'atom'

export function sortBy (colors, param='hue') {
  return colors.sort((c1, c2) => c1[param] > c2[param] ? 1 : c1[param] < c2[param] ? -1 : 0)
}

export function isEditor (editor) {
  return editor instanceof TextEditor && editor.isAlive()
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
    try {
      customElements.define(tagName, viewClass)
    }
    catch (e) {
      output.push(new Error(e))
    }
  }
  return output
}

export function notifyOnDebug (message, level='info') {
  if (atom.devMode)
    atom.notifications.add(level, message)
}
