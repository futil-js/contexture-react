import React from 'react'
import _ from 'lodash/fp'
import * as F from 'futil'
import { setDisplayName } from 'recompose'
import { observer } from 'mobx-react'
import { Dynamic, Flex } from 'grey-vest'
import { withTheme } from '../../utils/theme'

const moveColumn = (
  mutate,
  computeNextIndex,
  field,
  visibleFields,
  includes
) => {
  let visibleFieldIndex = _.findIndex({ field }, visibleFields)
  let nextField = _.flow(
    _.nth(computeNextIndex(visibleFieldIndex)),
    _.get('field')
  )(visibleFields)
  mutate({
    include: F.moveIndex(
      _.indexOf(field, includes),
      _.indexOf(nextField, includes),
      includes
    ),
  })
}

let popoverStyle = {
  userSelect: 'none',
}

let HeaderCellDefault = _.flow(
  setDisplayName('HeaderCell'),
  observer
)(({ activeFilter, style, children }) => (
  <th style={{ ...(activeFilter ? { fontWeight: 900 } : {}), ...style }}>
    {children}
  </th>
))

let Header = ({
  field: fieldSchema,
  includes,
  addOptions,
  addFilter,
  tree,
  node,
  mutate,
  criteria,
  mapNodeToProps,
  fields,
  visibleFields,
  theme: {
    DropdownItem,
    Icon,
    Dropdown,
    Modal,
    NestedPicker,
    UnmappedNodeComponent,
  },
}) => {
  let popover = React.useState(false)
  let adding = React.useState(false)
  let filtering = React.useState(false)
  let {
    disableFilter,
    disableSort,
    field,
    sortField = field,
    label,
    hideMenu,
    typeDefault,
  } = fieldSchema
  let HeaderCell = fieldSchema.HeaderCell || HeaderCellDefault
  let filterNode =
    criteria &&
    _.find({ field }, _.getOr([], 'children', tree.getNode(criteria)))
  let filter = () => {
    if (!filterNode) addFilter(field)
    filterNode =
      criteria &&
      _.find({ field }, _.getOr([], 'children', tree.getNode(criteria)))
    tree.mutate(filterNode.path, { paused: false })
    F.flip(filtering)()
  }
  let Label = label
  return (
    <HeaderCell
      style={{ cursor: 'pointer' }}
      activeFilter={_.get('hasValue', filterNode)}
    >
      <Flex alignItems="center">
        <span onClick={F.flip(popover)}>
          {_.isFunction(label) ? <Label /> : label}
        </span>
        {field === node.sortField && (
          <Icon
            icon={node.sortDir === 'asc' ? 'SortAscending' : 'SortDescending'}
          />
        )}
        {hideMenu ? null : (
          <Dropdown
            trigger="icon"
            open={{
              get: () => F.view(popover),
              set(x) {
                // Only turn off the popover if adding is not true
                if (!F.view(adding) && _.isBoolean(x)) F.set(x)(popover)
              },
            }}
            style={popoverStyle}
          >
            {!disableSort && (
              <DropdownItem
                onClick={() => {
                  F.off(popover)()
                  mutate({ sortField, sortDir: 'asc' })
                }}
                icon={<Icon icon="SortAscending" />}
              >
                Sort Ascending
              </DropdownItem>
            )}
            {!disableSort && (
              <DropdownItem
                onClick={() => {
                  F.off(popover)()
                  mutate({ sortField, sortDir: 'desc' })
                }}
                icon={<Icon icon="SortDescending" />}
              >
                Sort Descending
              </DropdownItem>
            )}
            <DropdownItem
              onClick={() =>
                moveColumn(mutate, i => i - 1, field, visibleFields, includes)
              }
              icon={<Icon icon="MoveLeft" />}
            >
              Move Left
            </DropdownItem>
            <DropdownItem
              onClick={() =>
                moveColumn(mutate, i => i + 1, field, visibleFields, includes)
              }
              icon={<Icon icon="MoveRight" />}
            >
              Move Right
            </DropdownItem>
            <DropdownItem
              onClick={() => mutate({ include: _.without([field], includes) })}
              icon={<Icon icon="RemoveColumn" />}
            >
              Remove Column
            </DropdownItem>
            {!!addOptions.length && (
              <DropdownItem
                onClick={F.on(adding)}
                icon={<Icon icon="AddColumn" />}
              >
                Add Column
              </DropdownItem>
            )}
            {criteria && (typeDefault || filterNode) && !disableFilter && (
              <div>
                <DropdownItem
                  onClick={filter}
                  icon={
                    <Icon
                      icon={
                        filterNode
                          ? F.view(filtering)
                            ? 'FilterCollapse'
                            : 'FilterExpand'
                          : 'FilterAdd'
                      }
                    />
                  }
                >
                  Filter
                </DropdownItem>
                {F.view(filtering) && filterNode && !filterNode.paused && (
                  <Dynamic
                    {...{
                      component: UnmappedNodeComponent,
                      tree,
                      path: _.toArray(filterNode.path),
                      ...mapNodeToProps(filterNode, fields),
                    }}
                  />
                )}
              </div>
            )}
          </Dropdown>
        )}
      </Flex>
      <Modal open={adding}>
        <NestedPicker
          options={addOptions}
          onChange={field => {
            if (!_.contains(field, includes))
              mutate({ include: [...includes, field] })
            F.off(adding)()
          }}
        />
      </Modal>
    </HeaderCell>
  )
}

export default _.flow(
  observer,
  withTheme
)(Header)
