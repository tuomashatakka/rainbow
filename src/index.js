'use babel'
import { CompositeDisposable, Disposable } from 'atom'
import { findColorsInCurrentEditor } from './actions'
import { defineElements, notifyOnDebug } from './utils'
import { URI_NAMESPACE } from './definitions'
import raise from './exceptions'
import Panel from './views/Panel'
import SwatchView from './views/SwatchView'
import PaletteView from './views/PaletteView'
import ColorMarker from './views/ColorMarker'
import ScopeManager from './models/ScopeManager'

let subscriptions
let panel
let elements = {
  [PaletteView.tag]:  PaletteView,
  [SwatchView.tag]:   SwatchView,
}

export function initialize () {
  subscriptions = new CompositeDisposable()
  let errors    = defineElements(elements)

  if (errors.length)
    raise('ELEMENT_DEFINITION_EXCEPTION', 'fatal')
}

export async function activate () {
  notifyOnDebug("Rainbow yiss!")
  subscriptions.add(registerViewProvider())
  panel = await atom.workspace.open(Panel.URI)
  subscriptions.add(
    registerCommands(panel),
    registerListenerService(panel)
  )
}

export function deactivate () {
  subscriptions.dispose()
  if (panel) {
    panel.destroy()
    panel = null
  }
}


// Subscriptions

const registerViewProvider = subscribe(() => [
  atom.workspace.addOpener(opener),
  atom.views.addViewProvider(Panel, provider),
  atom.views.addViewProvider(ColorMarker, markerProvider)
])

const registerCommands = subscribe(panel => [
  atom.commands.add(
    'atom-workspace',
    'rainbow:find-colors-in-current-editor',
    findColorsInCurrentEditor.bind(panel))
])

const registerListenerService = panel => {
  let manager = new ScopeManager(panel)
  return new Disposable(() => manager.destroy())
}


// Helper functions for activation

const opener = uri =>
  uri.startsWith(URI_NAMESPACE) ? new Panel() : null

const provider = (model) => {
  let el = document.createElement(PaletteView.tag)
  el.model = model
  return el
}

const markerProvider = (model) => {
  let el = model.item || document.createElement(SwatchView.tag)
  el.model = model
  return el
}

function subscribe (generator) {
  return (...args) => {
    let composite = new CompositeDisposable()
    composite.add(...generator(...args))
    return composite
  }
}
