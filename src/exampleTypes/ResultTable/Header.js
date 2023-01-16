import React from 'react'
import _ from 'lodash/fp.js'
import F from 'futil'
import { observer } from 'mobx-react'
import { Dynamic } from '../../greyVest/index.js'
import { useTheme } from '../../utils/hooks.js'

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
  width: 'auto',
}

export default observer(function Header({
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
  isStickyColumn,
  isLastColumn,
  theme,
}) {
  theme = useTheme(theme)
  let adding = React.useState(false)
  let {
    disableFilter,
    disableSort,
    field,
    sortField = field,
    label,
    hideRemoveColumn,
    hideMenu,
    typeDefault,
  } = fieldSchema
  let HeaderCell = fieldSchema.HeaderCell || theme.Th
  let filterNode =
    criteria &&
    _.find({ field }, _.getOr([], 'children', tree.getNode(criteria)))
  let filtering = React.useState(!!filterNode && !_.get('paused', filterNode))
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
      className={`${isStickyColumn ? 'sticky-column-header' : ''}
        ${_.get('hasValue', filterNode) ? 'active-filter' : ''}`}
      style={{
        cursor: hideMenu ? 'default' : 'pointer',
        left: isStickyColumn ? 0 : '',
      }}
    >
      <span>
        {_.isFunction(label) ? <Label /> : label}{' '}
        {field === node.sortField && (
          <theme.Icon
            icon={node.sortDir === 'asc' ? 'SortAscending' : 'SortDescending'}
          />
        )}
        <theme.Popover
          trigger={hideMenu ? null : <theme.Icon icon="TableColumnMenu" />}
          position={`bottom ${isLastColumn ? 'right' : 'center'}`}
          closeOnPopoverClick={false}
          style={popoverStyle}
        >
          {!disableSort && (
            <theme.DropdownItem
              onClick={() => {
                mutate({ sortField, sortDir: 'asc' })
              }}
            >
              <theme.Icon icon="SortAscending" />
              Sort Ascending
            </theme.DropdownItem>
          )}
          {!disableSort && (
            <theme.DropdownItem
              onClick={() => {
                mutate({ sortField, sortDir: 'desc' })
              }}
            >
              <theme.Icon icon="SortDescending" />
              Sort Descending
            </theme.DropdownItem>
          )}
          <theme.DropdownItem
            onClick={() =>
              moveColumn(mutate, (i) => i - 1, field, visibleFields, includes)
            }
          >
            <theme.Icon icon="MoveLeft" />
            Move Left
          </theme.DropdownItem>
          <theme.DropdownItem
            onClick={() =>
              moveColumn(mutate, (i) => i + 1, field, visibleFields, includes)
            }
          >
            <theme.Icon icon="MoveRight" />
            Move Right
          </theme.DropdownItem>
          {!hideRemoveColumn && (
            <theme.DropdownItem
              onClick={() => mutate({ include: _.without([field], includes) })}
            >
              <theme.Icon icon="RemoveColumn" />
              Remove Column
            </theme.DropdownItem>
          )}
          {!!addOptions.length && (
            <theme.DropdownItem onClick={F.on(adding)}>
              <theme.Icon icon="AddColumn" />
              Add Column
            </theme.DropdownItem>
          )}
          {criteria && (typeDefault || filterNode) && !disableFilter && (
            <div>
              <theme.DropdownItem onClick={filter}>
                <theme.Icon
                  icon={
                    filterNode
                      ? F.view(filtering)
                        ? 'FilterCollapse'
                        : 'FilterExpand'
                      : 'FilterAdd'
                  }
                />
                Filter
              </theme.DropdownItem>
              {F.view(filtering) && filterNode && !filterNode.paused && (
                <>
                  <Dynamic
                    {...{
                      component: theme.UnmappedNodeComponent,
                      tree,
                      path: _.toArray(filterNode.path),
                      ...mapNodeToProps(filterNode, fields),
                    }}
                  />
                  {tree.disableAutoUpdate && node.markedForUpdate && (
                    <theme.Button
                      primary
                      style={{ width: '100%' }}
                      onClick={(e) => {
                        e.stopPropagation()
                        tree.triggerUpdate()
                      }}
                    >
                      Search
                    </theme.Button>
                  )}
                </>
              )}
            </div>
          )}
          <theme.Modal open={adding}>
            <theme.NestedPicker
              itemType="column"
              options={addOptions}
              onChange={(selectedFields) => {
                _.each(({ field: addedField }) => {
                  let index = includes.indexOf(field)
                  if (index >= 0 && addedField) {
                    includes.splice(index + 1, 0, addedField)
                    mutate({ include: includes })
                  }
                }, selectedFields)
                F.off(adding)()
              }}
            />
          </theme.Modal>
        </theme.Popover>
      </span>
    </HeaderCell>
  )
})
