import React from 'react'
import _ from 'lodash/fp'
import * as F from 'futil'
import { setDisplayName } from 'recompose'
import { observer } from 'mobx-react'
import { Dynamic, Flex, Popover, Divider } from 'grey-vest'
import { withTheme } from '../../utils/theme'
import { useLensObject } from '../../utils/react'

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
    AlternateButton,
    Modal,
    NestedPicker,
    UnmappedNodeComponent,
  },
}) => {
  let state = useLensObject({ popup: true, adding: false, filtering: false })
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
    F.flip(state.filtering)()
  }
  let Label = label

  let triggerChildren = (
    <Flex
      alignItems="center"
      gap="xs"
      style={{ cursor: hideMenu ? 'default' : 'pointer' }}
    >
      <span style={{ flex: 0 }}>{_.isFunction(label) ? <Label /> : label}</span>
      {field === node.sortField && (
        <Icon
          icon={node.sortDir === 'asc' ? 'SortAscending' : 'SortDescending'}
        />
      )}
      {!hideMenu && <AlternateButton small icon="TableColumnMenu" />}
    </Flex>
  )

  return (
    <HeaderCell activeFilter={_.get('hasValue', filterNode)}>
      {hideMenu ? (
        triggerChildren
      ) : (
        <Popover
          keepOpen
          Trigger="div"
          label={triggerChildren}
          popupProps={{ padding: 0 }}
          style={{ userSelect: 'none' }}
        >
          {!disableSort && (
            <>
              <DropdownItem
                closePopup
                onClick={() => {
                  mutate({ sortField, sortDir: 'asc' })
                }}
                icon={<Icon icon="SortAscending" />}
              >
                Sort ascending
              </DropdownItem>
              <DropdownItem
                closePopup
                onClick={() => {
                  mutate({ sortField, sortDir: 'desc' })
                }}
                icon={<Icon icon="SortDescending" />}
              >
                Sort descending
              </DropdownItem>
              <Divider />
            </>
          )}
          <DropdownItem
            closePopup
            onClick={() =>
              moveColumn(mutate, i => i - 1, field, visibleFields, includes)
            }
            icon={<Icon icon="MoveLeft" />}
          >
            Move left
          </DropdownItem>
          <DropdownItem
            closePopup
            onClick={() =>
              moveColumn(mutate, i => i + 1, field, visibleFields, includes)
            }
            icon={<Icon icon="MoveRight" />}
          >
            Move right
          </DropdownItem>
          <DropdownItem
            closePopup
            onClick={() => mutate({ include: _.without([field], includes) })}
            icon={<Icon icon="RemoveColumn" />}
          >
            Remove column
          </DropdownItem>
          {!!addOptions.length && (
            <DropdownItem
              onClick={F.on(state.adding)}
              icon={<Icon icon="AddColumn" />}
            >
              Add column
            </DropdownItem>
          )}
          {criteria && (typeDefault || filterNode) && !disableFilter && (
            <>
              <Divider />
              <DropdownItem
                onClick={filter}
                icon={
                  <Icon
                    icon={
                      filterNode
                        ? F.view(state.filtering)
                          ? 'FilterCollapse'
                          : 'FilterExpand'
                        : 'FilterAdd'
                    }
                  />
                }
              >
                Filter column
              </DropdownItem>
              {F.view(state.filtering) && filterNode && !filterNode.paused && (
                <div style={{ padding: '4px 12px' }}>
                  <Dynamic
                    {...{
                      component: UnmappedNodeComponent,
                      tree,
                      path: _.toArray(filterNode.path),
                      ...mapNodeToProps(filterNode, fields),
                    }}
                  />
                </div>
              )}
            </>
          )}
        </Popover>
      )}
      <Modal open={state.adding}>
        <NestedPicker
          options={addOptions}
          onChange={field => {
            if (!_.contains(field, includes))
              mutate({ include: [...includes, field] })
            F.off(state.adding)()
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
