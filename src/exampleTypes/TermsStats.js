import React from 'react'
import { observer } from 'mobx-react'
import { useNode, useTheme } from '../utils/hooks.js'

let TermsStats = ({ tree, path, node, theme, ...props }) => {
  node = useNode(node, path, tree)
  let { Loader, BarChart } = useTheme(theme)
  return (
    <Loader node={node}>
      <BarChart
        data={node.context.terms}
        categoryField="key"
        valueField={node.order}
        yAxis
        {...props}
      />
    </Loader>
  )
}

export default observer(TermsStats)
