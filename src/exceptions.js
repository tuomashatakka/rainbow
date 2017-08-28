'use babel'

export function raise (error, level='error') {

  if (module.exports[error])
    error = module.exports[error]

  if (!error || !error.length)
    return

  atom.notifications.add(level, error.message || error)

  if (atom.devMode)
    if (typeof error === 'string')
      throw new Error(error)
    else
      throw error
}

export const NO_ACTIVE_EDITOR_EXCEPTION =
  `Could not find a text editor to search the colors in.`

export const ELEMENT_DEFINITION_EXCEPTION =
  `Error while registering custom elements for the Rainbow package.`

export const UNBOUND_ACTION_CALL_EXCEPTION =
  `Incorrectly bound function called as an action.`

export const UNKNOWN_VARIABLE_PREFIX_EXCEPTION =
  `Trying to register a variable name with an unknown prefix`

export const UNDEFINED_MARKER_EXCEPTION =
  `Could not resolve a marker for the current cursor position`

export const TEXT_EDITOR_PARAM_MISSING_EXCEPTION =
  new ReferenceError(`Constructor calls to the ColorMarker class mustinclude a TextEditor instance as their first argument`)

export default raise
