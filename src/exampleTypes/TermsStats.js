import React from 'react'
import { observer } from 'mobx-react'
import BarChart from '../layout/BarChart'

export default observer(({ node, ...props }) => (
  <BarChart
    data={node.context.terms}
    categoryField="key"
    valueField={node.order}
    yAxis
    {...props}
  />
))
