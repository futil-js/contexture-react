import React from 'react'
import { observer } from 'mobx-react'
import { toNumber } from '../utils/format.js'
import { FacetCheckboxList, displayFn, displayBlankFn } from '../utils/facet.js'
import { useNode, useTheme } from '../utils/hooks.js'

let DateRangeFacet = ({
  tree,
  node,
  hide = {
    counts: false, // Hide the facet counts so only the labels are displayed
  },
  display = displayFn,
  displayBlank = displayBlankFn,
  formatCount = toNumber,
  path,
  theme,
}) => {
  node = useNode(node, path, tree)
  let { Loader } = useTheme(theme)
  return (
    <Loader node={node}>
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
    </Loader>
  )
}

export default observer(DateRangeFacet)
