'use babel'
import { match } from './definitions'
import { TextEditor } from 'atom'
import { tag as swatchTagName } from './views/SwatchView'

export function sortBy (colors, param='hue') {
  return colors.sort((c1, c2) => c1[param] > c2[param] ? 1 : c1[param] < c2[param] ? -1 : 0)
}

export function isEditor (editor) {
  return editor instanceof TextEditor && editor.isAlive()
}

export const isSwatch  = el =>
  el.tagName === swatchTagName.toUpperCase()

export function findSwatch (ev) {
  let el = findSwatchElement(ev)
  return el ? el.color : null
}
export function findSwatchElement (ev) {
  let { path } = ev
  let mode = path.length ? 'event' : 'node'
  let el = ev.target
  while (path.length || el) {
    if (isSwatch(el))
      return el
    el = mode === 'event' ? path.shift() : el.parentElement
  }
  return null
}

export function combine (...re) {
  let unprefixed = (re.length && re[0] === 'unprefixed') ? re.shift() : false
  let pre    = match.prefix.source
  let vari   = match.variable.source
  let prefix = unprefixed ? `${pre}` :`(?:${vari})?${pre}`
  let source = re.map(item => item.source || item).join('|')
  return new RegExp(`${prefix}(${source})`, 'ig')
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
