import React from 'react'
import { observer } from 'mobx-react'
import { useNode, useTheme } from '../utils/hooks.js'

export default observer(function TermsStats({
  tree,
  path,
  node,
  theme,
  ...props
}) {
  node = useNode(node, path, tree)
  theme = useTheme(theme)
  return (
    <theme.Loader loading={node.updating}>
      <theme.BarChart
        data={node.context.terms}
        categoryField="key"
        valueField={node.order}
        yAxis
        {...props}
      />
    </theme.Loader>
  )
})
