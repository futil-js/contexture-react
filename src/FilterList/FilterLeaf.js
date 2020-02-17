import React from 'react'
import _ from 'lodash/fp'
import F from 'futil'
import { observer } from 'mobx-react'
import { Flex, Dynamic, Divider } from 'grey-vest'
import { withTheme } from '../utils/theme'
import Label from './Label'

let FilterLeaf = ({
  node,
  parent,
  tree,
  fields,
  mapNodeToProps,
  mapNodeToLabel,
  padding,
  theme: { UnmappedNodeComponent, Button },
}) => (
  <div key={node.path}>
    <Label {...{ tree, node, fields, padding }}>
      {mapNodeToLabel(node, fields)}
    </Label>
    {!node.paused && (
      <Flex column gap="sm" style={{ padding, paddingTop: 0 }}>
        <Dynamic
          {...{ tree, node, path: _.toArray(node.path) }}
          component={UnmappedNodeComponent}
          {...mapNodeToProps(node, fields)}
        />
        {!node.updating &&
          tree.disableAutoUpdate &&
          // find if any nodes in the tree are marked for update (i.e. usually nodes are marked for update because they react to "others" reactor)
          _.some(
            treeNode => treeNode !== parent && treeNode.markedForUpdate,
            F.treeToArray(_.get('children'))(tree.tree)
          ) && (
            <Button
              small
              onClick={() => tree.triggerUpdate()}
              compact
              primary
              style={{ alignSelf: 'flex-start' }}
            >
              Apply Filter
            </Button>
          )}
      </Flex>
    )}
    <Divider margin={0} />
  </div>
)

export default _.flow(
  observer,
  withTheme
)(FilterLeaf)
