import React from 'react'
import { useNode } from '../../utils/hooks.js'
import { Flex, ErrorList } from '../../greyVest/index.js'

let UnmappedNodeComponent = ({ node, path, tree }) => {
  node = useNode(node, path, tree)
  // Min Height here is to align better in QueryBuilder
  return (
    <Flex style={{ minHeight: '40px', alignItems: 'center' }}>
      <ErrorList>
        Type <b>{node.type}</b> is not supported (for key <i>{node.key}</i>)
      </ErrorList>
    </Flex>
  )
}

export default UnmappedNodeComponent
