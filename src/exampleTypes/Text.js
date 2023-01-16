import F from 'futil'
import React from 'react'
import { observer } from 'mobx-react'
import { useNode, useTheme } from '../utils/hooks.js'

export default observer(function Text({
  tree,
  path,
  node,
  theme,
  prop = 'value',
  ...props
}) {
  node = useNode(node, path, tree)
  theme = useTheme(theme)
  let lens = tree.lens(node.path, prop)
  return (
    <theme.Loader loading={node.updating}>
      <theme.TextInput {...F.domLens.value(lens)} {...props} />
    </theme.Loader>
  )
})
