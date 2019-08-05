import React from 'react'
import _ from 'lodash/fp'
import { contexturify, defaultTheme } from '../utils/hoc'

let Query = _.flow(
  defaultTheme({ TextInput: 'input' }),
  contexturify
)(({ tree, node, theme }) => (
  <theme.TextInput
    value={node.query || ''}
    onChange={e =>
      tree.mutate(node.path, {
        query: e.target.value,
      })
    }
    placeholder="Search"
  />
))
Query.displayName = 'Query'

export default Query
