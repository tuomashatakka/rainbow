'use babel'
import { combine } from './utils'
import { match, VARIABLE_PREFIX } from './definitions'

export const anyColor = combine(match.colors.hex, match.colors.rgb)

export function queryHandler (_, prefix, var_name, assignment, type, hex_value, rgb_value) {
  let value  = rgb_value || hex_value
  let name   = parseVariableName(prefix, var_name, assignment)
  let color  = parseColor(type, value)
  return { color, name }
}

export async function matchColors (text) {
  const colors   = []
  text.replace(anyColor, (...args) => colors.push(queryHandler(...args)))
  return colors
}


export async function matchVars (text) {

  const vars   = []
  const parser = (_, prefix, name, assignment) => {
    let ns = parseVariableName(prefix, name, assignment)
    vars.push(ns)
  }

  text.replace(match.variable, parser)
  return vars
}


function parseVariableName (prefix, name, assignment) {
  if (!prefix)
    return null
  assignment = assignment ? true : false
  prefix     = VARIABLE_PREFIX[prefix]
  return { assignment, name, prefix }
}


function parseColor (type, val) {

  const { min, max } = Math
  const limit = (val, isAlpha) => isAlpha
    ? max(min(1, parseFloat(val)), 0)
    : max(min(255, parseInt(val)), 0)
  if (type === '#')
    return '#' + val
  return val
    .split(',')
    .map((component, n) => limit(component.trim(), n === 3))
}
