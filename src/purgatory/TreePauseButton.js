import React from 'react'
import _ from 'lodash/fp.js'
import { observer } from 'mobx-react'
import { useTheme } from '../utils/hooks.js'

let setPausedNested = (tree, path, value) =>
  tree[`${value ? '' : 'un'}pauseNested`](path)

let TreePauseButton = ({ children, theme, Component }) => {
  let { AlternateButton } = useTheme(theme)
  Component ||= AlternateButton
  let trees = _.flow(React.Children.toArray, _.map('props'))(children)
  let allPaused = _.every(({ tree, path }) => tree.isPausedNested(path), trees)
  let flip = () =>
    _.each(({ tree, path }) => setPausedNested(tree, path, !allPaused), trees)
  return (
    <Component onClick={flip}>
      {`${allPaused ? 'Expand' : 'Collapse'} Filters`}
    </Component>
  )
}

export default observer(TreePauseButton)
