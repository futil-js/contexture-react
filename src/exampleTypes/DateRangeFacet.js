import React from 'react'
import { toNumber } from '../utils/format.js'
import { FacetCheckboxList, displayFn, displayBlankFn } from '../utils/facet.js'
import { observer } from 'mobx-react'
import { useNode, useTheme } from '../utils/hooks.js'

export default observer(function DateRangeFacet({
  tree,
  node,
  path,
  theme,
  // Hide the facet counts so only the labels are displayed
  hide = { counts: false },
  display = displayFn,
  displayBlank = displayBlankFn,
  formatCount = toNumber,
}) {
  node = useNode(node, path, tree)
  theme = useTheme(theme)
  return (
    <theme.Loader loading={node.updating}>
      <div className="contexture-daterangefacet" data-path={node.path}>
        <FacetCheckboxList
          tree={tree}
          node={node}
          hide={hide}
          display={display}
          displayBlank={displayBlank}
          formatCount={formatCount}
        />
      </div>
    </theme.Loader>
  )
})
