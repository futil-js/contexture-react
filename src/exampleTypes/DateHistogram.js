import React from 'react'
import { observer } from 'mobx-react'
import BarChart from '../layout/BarChart'

export default observer(({ node, ...props }) => (
  <BarChart
    data={node.context.entries}
    categoryField="key"
    valueField="count"
    gutter={0}
    {...props}
  />
))
