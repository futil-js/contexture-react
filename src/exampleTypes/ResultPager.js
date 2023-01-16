import F from 'futil'
import React from 'react'
import { observer } from 'mobx-react'
import { useNode, useTheme } from '../utils/hooks.js'
import { Pager } from '../greyVest/index.js'

let ResultPager = ({ tree, path, node, theme }) => {
  node = useNode(node, path, tree)
  let { PagerItem, Icon } = useTheme(theme)
  let pages = Math.ceil(
    F.cascade(['response.totalRecords', 'totalRecords'], node.context, 1) /
      node.pageSize
  )
  let page = node.page || 1
  return (
    <Pager
      value={page}
      pageCount={pages}
      onChange={(page) => tree.mutate(node.path, { page })}
      {...{ PagerItem, Icon }}
    />
  )
}

export default observer(ResultPager)
