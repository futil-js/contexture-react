import React from 'react'
import { observer } from 'mobx-react'
import _ from 'lodash/fp.js'
import { StripedLoader } from '../greyVest/index.js'
import { wrapDisplayName } from './react.js'
import { withTheme } from './theme.js'

/**
 * @deprecated
 */
export let withNode = (Component) =>
  wrapDisplayName(
    'withNode',
    Component
  )((props) => {
    let { tree, node, path } = props
    node = node || (tree && path && tree.getNode(path))

    if (!node)
      throw Error(`Node not provided, and couldn't find node at ${path}`)

    return <Component {...props} node={node} />
  })

/**
 * @deprecated
 */
export let withLoader = (Component) =>
  _.flow(
    wrapDisplayName('withLoader', Component),
    observer
  )(({ Loader, ...props }) => {
    let { theme = {}, node } = props
    Loader = Loader || theme.Loader || StripedLoader
    return (
      <Loader loading={node && node.updating}>
        <Component node={node} {...props} />
      </Loader>
    )
  })

/**
 * @deprecated
 */
export let contexturify = _.flow(observer, withLoader, withNode, withTheme)

/**
 * @deprecated
 */
export let contexturifyWithoutLoader = _.flow(observer, withNode, withTheme)
