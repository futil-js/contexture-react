import _ from 'lodash/fp'
import * as F from 'futil'
import { useState, forwardRef, createElement } from 'react'
import { mapProps, setDisplayName } from 'recompose'

export let useLensObject = _.mapValues(useState)

export let getDisplayName = Component =>
  F.cascade(['displayName', 'name'], Component) || 'Unknown'

export let wrapDisplayName = (name, Component) => Wrapped => {
  Wrapped.displayName = `${name}(${getDisplayName(Component)})`
  return Wrapped
}

// (k, a -> {b}) -> Component<{k: a}> -> Component<{b}>
export let expandProp = _.flow(
  (key, fn) => F.expandObjectBy(key, F.whenExists(fn)),
  mapProps
)

export let defaultProps = props => BaseComponent => {
  const DefaultProps = forwardRef((childProps, ref) =>
    createElement(BaseComponent, { ...childProps, ref })
  )
  DefaultProps.defaultProps = props
  return setDisplayName(wrapDisplayName('defaultProps', BaseComponent))(
    DefaultProps
  )
}
