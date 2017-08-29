'use babel'

import { Directory } from 'atom'

async function getFilesList (directory, options={}) {
  const entries = []
  const resolve = await new Promise(finished => directory.getEntries((err, raw) =>
    err ? finished([]) : finished(raw || [])))
  const pattern = options.match || options.ignore
  const rx      = new RegExp(pattern, 'gi')
  for (let entry of resolve) {

    if (pattern) {
      let path = entry.getPath()
      if (options.ignore && path.match(rx)) continue
      else if (options.match && path.match(rx) === null) continue
    }

    entries.push(...(entry instanceof Directory
      ? await getFilesList(entry, options)
      : [ entry ]))
  }

  return entries
}

export default class DirectoryTree {
  constructor () {
    this.baseDirectories = atom.project.getDirectories()
  }

  async getAllFiles () {
    let entries = []
    let ignore  = 'node_modules|\\.git'
    for (let base of this.baseDirectories) {
      let newEntries = await getFilesList(base, { ignore })
      entries.push(...newEntries)
    }
    return entries
  }

  async forEachFile (fn) {
    let entries = await this.getAllFiles()
    return entries.map(fn)
  }
}
