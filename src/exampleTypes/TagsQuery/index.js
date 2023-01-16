import F from 'futil'
import _ from 'lodash/fp.js'
import React from 'react'
import { observer } from 'mobx-react'
import { useNode } from '../../utils/hooks.js'
import ExpandableTagsQuery from '../ExpandableTagsQuery/index.js'
import ExpandableTagsInput, {
  Tags,
} from '../../greyVest/ExpandableTagsInput.js'

export default observer(function TagsQuery({
  tree,
  path,
  node,
  actionWrapper,
  ...props
}) {
  node = useNode(node, path, tree)
  let collapse = React.useState(true)
  let isCollapsed = F.view(collapse) && !_.isEmpty(node.tags)
  return (
    <div
      data-path={node.path}
      className="tags-query"
      onClick={F.off(collapse)}
      style={{ marginBottom: isCollapsed ? 28 : 10 }}
    >
      <ExpandableTagsQuery
        {...{ tree, node, collapse, actionWrapper, ...props }}
        onAddTag={F.off(collapse)}
        style={{ padding: '0 5px' }}
        theme={{
          Loader: ({ children }) => <div>{children}</div>,
          TagsInput: isCollapsed ? Tags : ExpandableTagsInput,
        }}
      />
    </div>
  )
})
