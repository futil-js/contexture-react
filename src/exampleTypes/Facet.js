import React from 'react'
import F from 'futil'
import _ from 'lodash/fp.js'
import { observer } from 'mobx-react'
import { toNumber } from '../utils/format.js'
import {
  displayFn,
  displayBlankFn,
  SelectAll,
  Cardinality,
  FacetCheckboxList,
  FacetOptionsFilter,
} from '../utils/facet.js'
import { useNode, useTheme } from '../utils/hooks.js'

// The hard limit to how many checked values we can allow in a facet
let maxChecked = 500
// The number of items selected after which we will show the warning message
let warningCheck = 250

export default observer(function Facet({
  tree,
  node,
  path,
  hide = {
    selectAll: false, // Hide the initial "Select All" checkbox
    radioList: false, // Hide the Include/Exclude radio list
    facetFilter: false, // Hide the search box above the facet checkboxes
    counts: false, // Hide the facet counts so only the labels are displayed
  },
  display = displayFn,
  displayBlank = displayBlankFn,
  formatCount = toNumber,
  theme,
}) {
  node = useNode(node, path, tree)
  theme = useTheme(theme)
  let valuesChecked = _.size(node.values)
  return (
    <theme.Loader loading={node.updating}>
      <div className="contexture-facet" data-path={node.path}>
        {valuesChecked > warningCheck && (
          <span>
            You have selected more than 250 items for this filter. Please
            consider using a different <b>filter type</b> or contact support for
            more search options. You will not be able to select more than 500
            items maximum.
          </span>
        )}
        {!hide.radioList && (
          <theme.RadioList
            value={node.mode || 'include'} // Fix by changing defaults in client example type
            onChange={(mode) => tree.mutate(node.path, { mode })}
            options={F.autoLabelOptions(['include', 'exclude'])}
          />
        )}
        {!hide.facetFilter && <FacetOptionsFilter tree={tree} node={node} />}
        {!hide.selectAll && (
          <SelectAll node={node} tree={tree} maxChecked={maxChecked} />
        )}
        <FacetCheckboxList
          tree={tree}
          node={node}
          hide={hide}
          display={display}
          displayBlank={displayBlank}
          formatCount={formatCount}
        />
        <Cardinality {...{ node, tree }} />
      </div>
    </theme.Loader>
  )
})
