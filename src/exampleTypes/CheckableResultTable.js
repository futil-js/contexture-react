import React from 'react'
import _ from 'lodash/fp.js'
import F from 'futil'
import { observer } from 'mobx-react'
import { getResults, getRecord } from '../utils/schema.js'
import { expandProp } from '../utils/react.js'
import { useNode, useTheme } from '../utils/hooks.js'
import ResultTable from './ResultTable/index.js'
import { selectedBinding } from './utils.js'

let Label = observer(function Label({ node, selected, getValue, theme }) {
  let results = _.toArray(getResults(node))
  let allChecked = _.size(results) === _.size(F.view(selected))
  let checkAll = F.sets(
    allChecked ? [] : _.map(_.flow(getRecord, _.iteratee(getValue)), results),
    selected
  )
  return <theme.Checkbox checked={allChecked} onChange={checkAll} />
})

// Extends ResultTable with a checkbox column
export default observer(function CheckableResultTable({
  node,
  path,
  tree,
  fields,
  getValue,
  theme,
  ...props
}) {
  node = useNode(node, path, tree)
  theme = useTheme(theme)
  let { selectedValues, onChange } = expandProp(
    'selected',
    selectedBinding,
    props
  )
  return (
    <ResultTable
      node={node}
      tree={tree}
      fields={{
        _checkbox: {
          hideMenu: true,
          label: () => (
            <Label
              {...{
                node,
                theme,
                selected: [selectedValues, onChange],
                getValue,
              }}
            />
          ),
          display: (x, y) => (
            <theme.Checkbox
              {...F.domLens.checkboxValues(_.iteratee(getValue)(y), [
                selectedValues,
                onChange,
              ])}
            />
          ),
        },
        ...fields,
      }}
      {...props}
    />
  )
})
