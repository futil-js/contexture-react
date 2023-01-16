import React from 'react'
import { observer } from 'mobx-react'
import { useNode, useTheme } from '../utils/hooks.js'

let Query = ({ tree, node, path, theme }) => {
  node = useNode(node, path, tree)
  let { Loader, TextInput } = useTheme(theme)
  return (
    <Loader node={node}>
      <TextInput
        value={node.query || ''}
        onChange={(e) =>
          tree.mutate(node.path, {
            query: e.target.value,
          })
        }
        placeholder="Search"
      />
    </Loader>
  )
}

export default observer(Query)
