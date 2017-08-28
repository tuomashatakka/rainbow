'use babel'

import { TextEditor, CompositeDisposable } from 'atom'


function destroyInactive (item) {
  if (item != this.editor)
    return
  this.destroy()
}


function getOverlayTemplate ({ color }) {
  return `
    <h4 class='severity'>Very serius</h4>
    <article class='excerpt'>${color.toString()}</article>`
}


export default class ColorOverlay {

  static getContent = getOverlayTemplate

  static decorations = {
    class: 'rainbow-color',
    type:  'overlay',
  }

  constructor (textEditor, properties={}) {

    if (!(textEditor instanceof TextEditor))
      throw new ReferenceError(`ColorOverlay's constructor must be called with a TextEditor instance as its first argument`)
    if (!properties.range || !properties.color)
      throw new ReferenceError(`ColorOverlay's constructor must be called with an object containing the color and range properties as its second argument`)
    const boundDestroyInactive    = destroyInactive.bind(this)
    const subscriptions = [
      atom.workspace.onDidChangeActivePaneItem(boundDestroyInactive),
      // this.editor.onDidChangePath(() => this.destroy()),
    ]

    this.properties = properties
    this.editor     = textEditor
    this.subscriptions = new CompositeDisposable()
    this.subscriptions.add(...subscriptions)
    this.show()
  }

  decorateEditor () {

    if (this.marker)
      this.marker.destroy()

    let { end: position } = this.properties.range

    if (!position)
      throw new TypeError(`Could not resolve a marker for the current cursor position while creating a new AnnotationMarker`)

    // let properties = { color: this.color }
    let decals  = { ...ColorOverlay.decorations, item: this.item }
    this.marker = this.editor.markBufferPosition(position, { invalidate: 'touch' })
    this.editor.decorateMarker(this.marker, decals)
  }

  show () {
    this.decorateEditor(this.editor)
    this.item.setAttribute('class', 'color-' + this.properties.color.hex)
    this.item.innerHTML = ColorOverlay.getContent(this.properties)
  }

  hide () {
    // this.item.innerHTML = ""
    this.item.classList.add('hidden')
  }

  destroy () {
    if (this.marker)
      this.marker.destroy()
    this.subscriptions.dispose()
  }

  get item () {
    if (!this._item)
      this._item = document.createElement('div')
    return this._item
  }
}
