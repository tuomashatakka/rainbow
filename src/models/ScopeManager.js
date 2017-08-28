'use babel'
import self from 'autobind-decorator'
import { CompositeDisposable, Disposable, TextEditor } from 'atom'
// import { findColorsInCurrentEditor } from '../actions'
import { anyColor, queryHandler } from '../parser'
import ColorMarker from '../views/ColorMarker'
// import ColorOverlay from '../views/ColorOverlay'

export default class ScopeManager {

  constructor (panel) {
    const editorContentSubscription = new Disposable(() =>
      this.editorContentSubscription ?
      this.editorContentSubscription.dispose() : null)

    this.markers       = {}
    this.subscriptions = new CompositeDisposable()
    this.panel         = panel

    this.subscriptions.add(
      atom.workspace.observeActiveTextEditor(this.didChangeActiveEditor),
      editorContentSubscription,
    )
  }

  @self
  subscribeToEditorChanges (editor) {
    if (this.editorContentSubscription)
      this.editorContentSubscription.dispose()
    if (editor instanceof TextEditor && editor.isAlive())
      this.editorContentSubscription = editor.onDidStopChanging((changes) =>
        this.editorContentDidChange(editor, changes))
  }

  @self
  didChangeActiveEditor (editor) {
    if (editor instanceof TextEditor && editor.isAlive())
      // findColorsInCurrentEditor.call(this.panel)
      this.subscribeToEditorChanges(editor)
  }

  @self
  async editorContentDidChange (editor) {
    if ((editor instanceof TextEditor) && editor.isAlive()) {
      let { palette } = this.panel.paletteView
      this.clearMarkers()
      await this.scan(editor)
      this.drawMarkers(editor, palette)
    }
  }

  @self
  async scan (editor) {
    const colors  = []
    const include = ({ range, match }) => {
      let result  = queryHandler(...match)
      result.meta = { range }
      colors.push(result)
    }
    editor.buffer.scan(anyColor, include)
    return await this.panel.paletteView.setColors(colors)
  }

  @self
  drawMarkers (editor, palette) {
    const colors = palette.colors
    const registerMarker = mk =>
      this.markers.add(new Disposable(() => mk.destroy()))
    colors.forEach(color =>
      registerMarker(new ColorMarker(editor, color)))
    this.updateStyle(palette.toCSS())
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

  @self
  updateStyle (css) {
    this.clearStyle()
    let style = typeof css === 'string' ? css : parseCssRules(css)
    this.style = atom.styles.addStyleSheet(style, { context: 'rainbox', priority: 6 })
    return this.style
  }

  destroy () {
    this.clearStyle()
    this.subscriptions.dispose()
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
