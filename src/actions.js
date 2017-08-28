'use babel'
import raise from './exceptions'
import Panel from './views/Panel'

export function findColorsInCurrentEditor () {
  // NOTE: This function should be called with
  // this bound to the package's `Panel` instance

  let editor = atom.workspace.getActiveTextEditor()
  let panel  = this

  if (!(panel instanceof Panel))
    raise('UNBOUND_ACTION_CALL_EXCEPTION')
  if (!editor)
    raise('NO_ACTIVE_EDITOR_EXCEPTION')

  let { paletteView } = panel
  let textContent = editor.buffer.getText()
  paletteView.applyColorsFromSource(textContent)
}
