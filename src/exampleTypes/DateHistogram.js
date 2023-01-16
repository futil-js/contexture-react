import React from 'react'
import { observer } from 'mobx-react'
import { useNode, useTheme } from '../utils/hooks.js'

let DateHistogram = ({ node, tree, path, theme, ...props }) => {
  node = useNode(node, path, tree)
  let { Loader, BarChart } = useTheme(theme)
  return (
    <Loader node={node}>
      <BarChart
        data={node.context.entries}
        categoryField="key"
        valueField="count"
        gutter={0}
        {...props}
      />
    </Loader>
  )
}

export default observer(DateHistogram)
