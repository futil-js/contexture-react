import _ from 'lodash/fp'
import F from 'futil-js'
import React from 'react'
import { Column } from '../layout/ExpandableTable'
import { contexturify, defaultTheme } from '../utils/hoc'
import TermsStatsTable from './TermsStatsTable'
import Checkbox from '../layout/Checkbox'

let CheckableTermsStatsTable = _.flow(
  defaultTheme({ TermsStatsTable, Checkbox, Column }),
  contexturify
)(
  ({ node, children, theme, getValue, selected, ...props }) => {
    let results = _.result('context.terms.slice', node)
    let allChecked = _.size(results) === _.size(F.view(selected))
    let checkAll = F.sets(
      allChecked ? [] : _.map(_.iteratee(getValue), results),
      selected
    )
    return (
      <theme.TermsStatsTable
        {...{
          ...props,
          children: [
            <theme.Column
              label={<theme.Checkbox checked={allChecked} onChange={checkAll} />}
              display={(x, y) => (
                <theme.Checkbox
                  {...F.domLens.checkboxValues(
                    _.iteratee(getValue)(y),
                    selected
                  )}
                />
              )}
            />,
            ...children,
          ],
        }}
      />
    )
  }
)
CheckableTermsStatsTable.displayName = 'CheckableTermsStatsTable'

export default CheckableTermsStatsTable
