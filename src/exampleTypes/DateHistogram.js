import React from 'react'
import _ from 'lodash/fp'
import { contexturify, defaultTheme } from '../utils/hoc'
import BarChart from '../layout/BarChart'

let DateHistogram = _.flow(
  defaultTheme({ BarChart }),
  contexturify
)(
  ({ node, theme, ...props }) => (
    <theme.BarChart
      data={node.context.entries}
      categoryField="key"
      valueField="count"
      gutter={0}
      {...props}
    />
  )
)
DateHistogram.displayName = 'DateHistogram'

export default DateHistogram
