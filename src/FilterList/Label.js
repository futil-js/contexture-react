import React from 'react'
import _ from 'lodash/fp'
import F from 'futil'
import { observer } from 'mobx-react'
import { Flex } from 'grey-vest'
import { withTheme } from '../utils/theme'
import FilterActions from './FilterActions'

let Label = ({
  tree,
  node,
  fields,
  padding,
  children,
  theme: { Icon, Text },
  ...props
}) => {
  let field = _.get('field', node)
  return (
    <Flex
      className={F.compactJoin(' ', [
        'filter-field-label',
        node.hasValue && 'filter-field-has-value',
      ])}
      style={{
        padding: `${padding}px ${padding * 1.5}px`,
        cursor: 'pointer',
      }}
      onClick={() =>
        tree && node && tree.mutate(node.path, { paused: !node.paused })
      }
      justifyContent="space-between"
      alignItems="center"
    >
      <Flex alignItems="center" gap="xs">
        <Text small bold {...props}>
          {children || _.get([field, 'label'], fields) || field || ''}
        </Text>
        {!node.paused && <FilterActions {...{ node, tree, fields }} />}
      </Flex>
      {tree && node && (
        <Icon
          style={{ opacity: 0.5 }}
          icon={node.paused ? 'FilterListExpand' : 'FilterListCollapse'}
        />
      )}
    </Flex>
  )
}

export default _.flow(
  observer,
  withTheme
)(Label)
