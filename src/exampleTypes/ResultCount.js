import React from 'react'
import { observer } from 'mobx-react'

export default observer(({ node }) => (
  <span>
    {node.context.response.results.length
      ? `${node.context.response.startRecord} - ${
          node.context.response.endRecord
        } out of ${node.context.response.totalRecords}`
      : 'No Results'}
  </span>
))
