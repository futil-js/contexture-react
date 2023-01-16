import React from 'react'
import { observer } from 'mobx-react'
import { useNode, useTheme } from '../utils/hooks.js'

export default observer(function Query({ tree, path, node, theme }) {
  node = useNode(node, path, tree)
  theme = useTheme(theme)
  return (
    <theme.Loader loading={node.updating}>
      <theme.TextInput
        value={node.query || ''}
        onChange={(e) =>
          tree.mutate(node.path, {
            query: e.target.value,
          })
        }
        placeholder="Search"
      />
    </theme.Loader>
  )
})
