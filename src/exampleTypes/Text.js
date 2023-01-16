import F from 'futil'
import React from 'react'
import { observer } from 'mobx-react'
import { useNode, useTheme } from '../utils/hooks.js'

let LensInput = ({ tree, path, node, theme, prop = 'value', ...props }) => {
  node = useNode(node, path, tree)
  let { Loader, TextInput } = useTheme(theme)
  let lens = tree.lens(node.path, prop)
  return (
    <Loader node={node}>
      <TextInput {...F.domLens.value(lens)} {...props} />
    </Loader>
  )
}

export default observer(LensInput)
