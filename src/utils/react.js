import _ from 'lodash/fp.js'
import F from 'futil'
import { useState } from 'react'

export let useLensObject = _.mapValues(useState)

let getDisplayName = (Component) =>
  F.cascade(['displayName', 'name'], Component) || 'Unknown'

/**
 * @deprecated
 */
export let wrapDisplayName = (name, Component) => (Wrapped) => {
  Wrapped.displayName = `${name}(${getDisplayName(Component)})`
  return Wrapped
}

export let expandProp = (key, fn, props) =>
  F.expandObjectBy(key, F.whenExists(fn))(props)
