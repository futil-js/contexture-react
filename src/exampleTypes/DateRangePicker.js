import React from 'react'
import _ from 'lodash/fp'
import DefaultSelect from '../layout/Select'
import { contexturify, defaultTheme } from '../utils/hoc'

let DateComponent = _.flow(
  defaultTheme({ Select: DefaultSelect }),
  contexturify
  )(
    ({ tree, node, ranges, theme }) => (
    <theme.Select
      value={(_.find({ from: node.from, to: node.to }, ranges) || {}).label}
      onChange={event => {
        let value = _.get('target.value', event)
        if (value) {
          let { from, to } = _.find({ label: value }, ranges)
          tree.mutate(node.path, { from, to })
        }
      }}
      options={_.map(x => ({ value: x.label, label: x.label }), ranges)}
    />
  )
)
DateComponent.displayName = 'DateRangePicker'

export default DateComponent
