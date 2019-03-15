import React from 'react'
import { observer } from 'mobx-react'

export default observer(({ tree, node, TextInput = 'input' }) => (
  <TextInput
    value={node.query || ''}
    onChange={e =>
      tree.mutate(node.path, {
        query: e.target.value,
      })
    }
    placeholder="Search"
  />
))
