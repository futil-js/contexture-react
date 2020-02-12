import React from 'react'
import F from 'futil'
import _ from 'lodash/fp'
import { TableFooter } from 'grey-vest'
import { contexturifyWithoutLoader } from '../../utils/hoc'

let getTotalRecords = F.cascade([
  'context.response.totalRecords',
  'context.totalRecords',
])

let ResultTableFooter = ({ tree, node, pageSizeOptions }) => (
  <TableFooter
    page={node.page || 1}
    onChangePage={page => tree.mutate(node.path, { page })}
    pageSize={node.pageSize}
    onChangePageSize={pageSize => {
      tree.mutate(node.path, {
        pageSize,
        page: _.min([node.page, _.ceil(getTotalRecords(node) / pageSize)]),
      })
    }}
    pageSizeOptions={pageSizeOptions}
    totalRecords={getTotalRecords(node)}
  />
)

export default contexturifyWithoutLoader(ResultTableFooter)
