import React from 'react'
import F from 'futil'
import DDContext from './DragDrop/DDContext.js'
import Group from './Group.js'
import styles from '../styles/index.js'
import { useTheme, useNode } from '../utils/hooks.js'

let { background } = styles

let QueryBuilder = ({ tree, path, node, fields, mapNodeToProps, theme }) => {
  node = useNode(node, path, tree)
  theme = useTheme(theme)
  let adding = React.useState(false)
  return (
    <div style={{ background }}>
      {node && (
        <Group
          isRoot={true}
          {...{
            node,
            tree,
            adding,
            fields,
            mapNodeToProps,
          }}
        />
      )}
      <theme.Button onClick={F.flip(adding)}>
        {F.view(adding) ? 'Cancel' : 'Add Filter'}
      </theme.Button>
    </div>
  )
}

export default DDContext(QueryBuilder, { allowEmptyNode: true })
