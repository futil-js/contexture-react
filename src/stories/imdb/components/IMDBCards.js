import _ from 'lodash/fp.js'
import React from 'react'
import { observer } from 'mobx-react'
import { Flex } from '../../../greyVest/index.js'
import { useNode, useTheme } from '../../../utils/hooks.js'

export default observer(function IMDBCards({ node, path, tree, theme }) {
  node = useNode(node, path, tree)
  let { Loader } = useTheme(theme)
  return (
    <Loader node={node}>
      <Flex style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
        {_.map(
          ({ _id, _source: { title, poster } }) => (
            <div key={_id} style={{ margin: '5px', textAlign: 'center' }}>
              <img src={poster} width="180" height="270" />
              <div
                style={{ width: '180px' }}
                dangerouslySetInnerHTML={{ __html: title }}
              />
            </div>
          ),
          node.context.response.results
        )}
      </Flex>
    </Loader>
  )
})
