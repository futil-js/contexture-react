import _ from 'lodash/fp'
import React from 'react'
import { contexturify, defaultTheme } from '../utils/hoc'
import BarChart from '../layout/BarChart'

let TermsStats = _.flow(
  defaultTheme({ BarChart }),
  contexturify
)(
  ({ node, ...props }) => (
    <theme.BarChart
      data={node.context.terms}
      categoryField="key"
      valueField={node.order}
      yAxis
      {...props}
    />
  )
)
TermsStats.displayName = 'TermsStats'

export default TermsStats
