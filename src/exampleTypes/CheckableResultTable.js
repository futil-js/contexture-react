import React from 'react'
import _ from 'lodash/fp'
import { observer } from 'mobx-react'
import F from 'futil-js'
import { getResults, getRecord } from '../utils/schema'
import { contexturify, defaultTheme } from '../utils/hoc'
import Checkbox from '../layout/Checkbox'
import ResultTable from './ResultTable'

let Label = _.flow(
  observer,
  defaultTheme({ Checkbox })
)(
  ({ node, theme, selected, getValue }) => {
    let results = _.toArray(getResults(node))
    let allChecked = _.size(results) === _.size(F.view(selected))
    let checkAll = F.sets(
      allChecked
        ? []
        : _.map(
            _.flow(
              getRecord,
              _.iteratee(getValue)
            ),
            results
          ),
      selected
    )
    return <theme.Checkbox checked={allChecked} onChange={checkAll} />
  }
)
Label.displayName = 'Label'

// Extends ResultTable with a checkbox column
// Writes to a lens called `selected`, using getValue to map the selected record to a value.
// getValues uses _.iteratee, so it defaults to identity and supports things like strings to get props
let CheckableResultTable = _.flow(
  defaultTheme({ Checkbox, ResultTable }),
  contexturify
)(
  ({ node, fields, selected, getValue, theme, ...props }) => (
    <theme.ResultTable
      fields={{
        _checkbox: {
          hideMenu: true,
          label: () => <Label {...{ node, selected, getValue }} />,
          display: (x, y) => (
            <theme.Checkbox
              {...F.domLens.checkboxValues(_.iteratee(getValue)(y), selected)}
            />
          ),
        },
        ...fields,
      }}
      {...props}
    />
  )
)
CheckableResultTable.displayName = 'CheckableResultTable'

export default CheckableResultTable
