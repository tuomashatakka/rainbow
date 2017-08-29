'use babel'

import self from 'autobind-decorator'
import { CompositeDisposable, Disposable } from 'atom'

import Palette from './Palette'
import { tag as swatchTagName } from '../views/SwatchView'
import ColorMarker from '../views/ColorMarker'
import { isEditor, findSwatch } from '../utils'
import { anyColor, preciseColor, queryHandler } from '../parser'
import Tree from './DirectoryTree'



const contextMenuEntries = [
  {
    label:   'Open editor for color',
    command: 'rainbow:open-editor-for-color'
  },
  {
    label:   'Copy value to clipboard',
    command: 'rainbow:copy-color-to-clipboard'
  },
  {
    label:   'Insert value to the editor',
    command: 'rainbow:copy-color-to-editor'
  },
]


export default class ScopeManager {

  constructor (panel) {
    const editorContentSubscription = new Disposable(() =>
      this.editorContentSubscription ?
      this.editorContentSubscription.dispose() : null)

    this.subscriptions = new CompositeDisposable()
    this.palette       = new Palette()
    this.markers       = {}
    this.panel         = panel

    this.palette.onDidAddColor((color) => this.paletteView.appendColors([ color ]))
    this.palette.onDidRemoveColor((colors) => this.paletteView.removeColors(colors))
    this.paletteView.onDidClickColor(this.onClick.bind(this))
    this.paletteView.onDidDoubleClickColor(this.onDoubleClick.bind(this))

    const commands = {
      'rainbow:open-editor-for-color': (ev) => openColorPosition(findSwatch(ev)),
      'rainbow:copy-color-to-clipboard': (ev) => atom.clipboard.write(findSwatch(ev).toString(), { type: 'color' }),
      'rainbow:copy-color-to-editor': (ev) =>this.insertColorToActiveEditor(findSwatch(ev)),
    }

    let activeEditorSubscription = atom.workspace.observeActiveTextEditor(this.didChangeActiveEditor)
    let contextMenuSubscription  = atom.contextMenu.add({ [swatchTagName]: contextMenuEntries })
    let commandSubscription      = atom.commands.add(swatchTagName, commands)
    this.subscriptions.add(
      activeEditorSubscription,
      editorContentSubscription,
      contextMenuSubscription,
      commandSubscription,
    )
    this.getColorsFromOpenEditors()
    findColorsFromProject(this.palette)
  }

  onClick (color) {
    this.paletteView.selectColor(color)
  }

  onDoubleClick (color) {
    this.insertColorToActiveEditor(color)
  }

  insertColorToActiveEditor (color, format='hex') {
    let ed = atom.workspace.getActiveTextEditor()
    ed.insertText(format && color[format] ? color[format] : '')
  }

  async getColorsFromOpenEditors () {
    let editors = atom.workspace.getTextEditors()
    let active  = atom.workspace.getActiveTextEditor()
    editors.forEach(this.scan)
    this.update(active)
  }

  get paletteView () {
    return this.panel.paletteView
  }

  @self
  subscribeToEditorChanges (editor) {
    if (this.editorContentSubscription)
      this.editorContentSubscription.dispose()
    if (isEditor(editor)) {
      let callback = () => this.update(editor)
      this.editorContentSubscription = editor.onDidStopChanging(callback)
    }
  }

  @self
  didChangeActiveEditor (editor) {
    if (isEditor(editor)) {
      this.subscribeToEditorChanges(editor)
      this.update(editor)
    }
  }

  @self
  async update (editor) {
    if (!isEditor(editor))
      return

    this.clearMarkers()

    // Find new colors
    const path = editor.getPath()
    let colors = await this.scan(editor)

    // Remove inexisting colors
    let oldColors = this.palette.getColorsWithMeta('path', path)
    let Color = require('./Color')
    let colorsToBeRemoved = oldColors.filter(color => !colors.find(nc => color.is(Color.from(nc.color))))
    this.palette.removeColors(colorsToBeRemoved)

    // Add the new colors
    this.palette.addColors(colors)

    // Show colors in current editor
    let colorsInEditor = this.palette.getColorsWithMeta('path', path)
    this.drawMarkers(editor, colorsInEditor)
  }

  @self
  async scan (editor) {
    if (!isEditor(editor))
      return

    let { buffer } = editor
    let path       = editor.getPath()
    const colors   = []
    const include  = (...arg) => {
      let { range, match } = arg[0]
      let color    = queryHandler(...match)
      let interplt = result => range = result.range
      editor.scanInBufferRange(preciseColor, range, interplt)
      color.meta   = { range, editor, path }
      colors.push(color)
    }
    buffer.scan(anyColor, include)
    return colors
  }

  @self
  drawMarkers (editor, colors) {
    // TODO: Check the colors are in the current editor
    const registerMarker = color => {
      let mk = new ColorMarker(editor, color)
      let disposable = new Disposable(() => mk.destroy())
      this.markers.add(disposable)
    }
    colors.forEach(registerMarker)
    this.updateStyle(this.palette.toCSS())
  }

  @self
  updateStyle (css) {
    this.clearStyle()
    let style = typeof css === 'string' ? css : parseCssRules(css)
    this.style = atom.styles.addStyleSheet(style, { context: 'rainbox', priority: 6 })
    return this.style
  }

  @self
  clearMarkers () {
    if (this.markers.disposed === false)
      this.markers.dispose()
    this.markers = new CompositeDisposable()
  }

  @self
  clearStyle () {
    if (this.style)
      this.style.dispose()
  }

  destroy () {
    this.clearStyle()
    this.subscriptions.dispose()
    this.palette.destroy()
  }
}

function parseCssRules (obj) {
  let stream = ``
  for (let className in obj) {
    let ruleset = obj[className]
    let rules = ''
    for (let attr in ruleset) {
      rules += `\n${attr}: ${ruleset[attr]};`
    }
    stream += `.${className} { ${rules} \n}`
  }
  return stream
}

function openColorPosition (color) {
  const range = color.meta.get('range')
  const path  = isEditor(color.meta.get('editor'))
    ? color.meta.get('editor')
    : color.meta.get('path')
  const focus = editor => {
    editor.scrollToBufferPosition(range.start)
    editor.setSelectedBufferRange(range)
  }

  atom.workspace.open(path)
    .then(focus)
}

async function findColorsFromProject (palette) {
  let tree    = new Tree()
  let entries = await tree.forEachFile(file => ({
    content: file.readSync(),
    path:    file.getPath(),
  }))

  for (let { content, path } of entries)
    palette.findColors(content, { path })
}
