import React from 'react'
import F from 'futil'
import { observer } from 'mobx-react'
import { toNumber } from '../utils/format.js'
import { useNode, useTheme } from '../utils/hooks.js'

export default observer(function ResultCount({
  tree,
  node,
  path,
  display = toNumber,
  noResults = 'No Results',
  theme,
}) {
  node = useNode(node, path, tree)
  theme = useTheme(theme)
  let count = F.cascade(
    [
      'context.response.results.length',
      'context.results.length',
      'context.result',
      'context.value',
    ],
    node
  )
  let totalRecords = count
    ? F.cascade(
        [
          'context.response.totalRecords',
          'context.totalRecords',
          'context.result',
          'context.value',
        ],
        node
      )
    : 0
  return count ? (
    display(totalRecords)
  ) : node.updating ? (
    <div
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        margin: '0 .1rem',
      }}
    >
      <theme.Loader
        loading
        style={{ height: '1rem', width: '1.5rem', minHeight: 'auto' }}
      />
    </div>
  ) : (
    noResults
  )
})
