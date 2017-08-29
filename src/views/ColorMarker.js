'use babel'

import { TextEditor } from 'atom'
import raise from '../exceptions'

export default class ColorMarker {

  static type = 'color'

  static decorations = {
    type: 'highlight',
    class: 'rainbow-color highlight-color',
    // onlyNonEmpty: true,
  }

  constructor (textEditor, color) {

    // TODO: Contain the highlight markers on a dedicated layer
    // let layer  = this.getLayer(textEditor)
    // let marker = layer.markBufferRange(range, { ...message })

    if (!(textEditor instanceof TextEditor))
      raise('TEXT_EDITOR_PARAM_MISSING_EXCEPTION')

    let className = color.getIdentifier()
    let range     = color.meta.get('range')
    this.props    = { className, range, color }
    this.marker   = textEditor.markBufferRange(range, this.properties)

    if (!this.marker)
      raise('UNDEFINED_MARKER_EXCEPTION')

    this.decoration = textEditor.decorateMarker(this.marker, this.decor)
    this.activeItemChangeSubscription = textEditor.onDidDestroy(() => this.destroy())
    // this.activeItemChangeSubscription = atom.workspace.onDidChangeActivePaneItem(() => this.destroy())
  }

  get properties () {
    let { type } = this.constructor
    return {
      type,
      invalidate: 'touch',
    }
  }

  get decor () {
    let { type, class: className } = this.constructor.decorations
    return {
      type,
      class: [ className, this.props.className ].join(' ')
    }
  }

  destroy () {
    this.marker.destroy()
    this.decoration.destroy()
    this.activeItemChangeSubscription.dispose()
  }

}
