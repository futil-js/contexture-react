import _ from 'lodash/fp.js'
import F from 'futil'
import React from 'react'
import { observer } from 'mobx-react'
import { Column } from '../greyVest/ExpandableTable.js'
import TermsStatsTable from './TermsStatsTable.js'
import { useNode, useTheme } from '../utils/hooks.js'

export default observer(function CheckableTermsStatsTable({
  node,
  path,
  tree,
  children,
  getValue,
  selected,
  theme,
  ...props
}) {
  node = useNode(node, path, tree)
  let { Loader, Checkbox } = useTheme(theme)
  let results = _.result('context.terms.slice', node)
  let allChecked = _.size(results) === _.size(F.view(selected))
  let checkAll = F.sets(
    allChecked ? [] : _.map(_.iteratee(getValue), results),
    selected
  )
  return (
    <Loader node={node}>
      <TermsStatsTable
        {...{
          ...props,
          children: [
            <Column
              key="checkbox"
              label={<Checkbox checked={allChecked} onChange={checkAll} />}
              display={(x, y) => (
                <Checkbox
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
    </Loader>
  )
})
