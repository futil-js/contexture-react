import React from 'react'
import { observer } from 'mobx-react'
import { useNode, useTheme } from '../utils/hooks.js'

export default observer(function DateHistogram({
  node,
  tree,
  path,
  theme,
  ...props
}) {
  node = useNode(node, path, tree)
  theme = useTheme(theme)
  return (
    <theme.Loader loading={node.updating}>
      <theme.BarChart
        data={node.context.entries}
        categoryField="key"
        valueField="count"
        gutter={0}
        {...props}
      />
    </theme.Loader>
  )
})
