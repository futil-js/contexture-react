import React from 'react'
import { observer } from 'mobx-react'
// import F from 'futil-js'
import _ from 'lodash/fp'
import StripedLoader from './StripedLoader'

// basically just for the Adder component, which sometimes uses the node to do filtering for `uniqueFields`
export let withOptionalNode = Component => props => {
  let { tree, node, path } = props
  node = node || (tree && path && tree.getNode(path))
  return <Component {...props} node={node} />
}

/*
let withEmptyNodeError = Component => props => {
  if (!_.has('node', props))
    throw Error(`Node not provided, and couldn't find node at ${props.path}`)
  return <Component {...props} />
}
*/

export let withNode = _.flow(
  withOptionalNode,
  //withEmptyNodeError,
)

export let withLoader = Component =>
  observer(({ Loader = StripedLoader, node, ...props }) => (
    <Loader loading={node && node.updating}>
      <Component node={node} {...props} />
    </Loader>
  ))

// I am a band-aid, please rip me off as quickly as possible
export let withInlineLoader = Component =>
  observer(({ Loader = StripedLoader, node, ...props }) => (
    <Loader loading={node && node.updating} style={{ display: 'inline-block' }}>
      <Component node={node} {...props} />
    </Loader>
  ))

export let contexturify = _.flow(
  observer,
  withOptionalNode,
  withLoader
)

// this is used for the text components
export let withTreeLens = Component => ({ prop = 'value', ...props }) => (
  <Component {...{ lens: props.tree.lens(props.node.path, prop), ...props }} />
)

// quick n' dirty substitute for defaultProps to support theme objects (not production code!!)
// two things to note:
// 1. if a component is wrapped in multiple levels of defaultTheme, the _outermost_ level takes
// precedence. eg, MyComponent will have blue buttons (unless superceded by a passed-in theme prop):
// _.flow(
//   defaultProps({ Button: RedButton }),
//   defaultProps({ Button: BlueButton }),
// )(MyComponent)
// 
// 2. don't even bother setting a default theme value in the component definition (eg.
// ({ theme = { Button: DefaultButton }, ...props }) => ...), since it can't support merging -
// just use this instead
export let defaultTheme = defaults => Component => ({ theme, ...props }) =>
  <Component {...props} theme={_.merge(defaults, theme)} />
