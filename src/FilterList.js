import React from 'react'
import _ from 'lodash/fp.js'
import F from 'futil'
import { observer } from 'mobx-react'
import { Expandable, Flex, Dynamic } from './greyVest/index.js'
import { fieldsToOptions } from './utils/fields.js'
import { bdJoin } from './styles/generic.js'
import {
  newNodeFromType,
  transformNodeFromField,
  getTypeLabel,
  getTypeLabelOptions,
} from './utils/search.js'
import { useNode, useTheme } from './utils/hooks.js'

export let FilterActions = observer(function FilterActions({
  node,
  tree,
  path,
  fields,
  popover,
  theme,
}) {
  node = useNode(node, path, tree)
  theme = useTheme(theme)
  let modal = React.useState(false)
  let typeOptions = _.flow(
    _.getOr([], [node.field, 'typeOptions']),
    _.without([node.type])
  )(fields)
  return (
    <>
      <theme.Modal open={modal}>
        <theme.NestedPicker
          options={fieldsToOptions(fields)}
          onChange={(pickedFields) => {
            // If several fields picked, using the last one user clicked on
            if (pickedFields.length > 0)
              tree.replace(
                node.path,
                transformNodeFromField({
                  field: _.last(pickedFields).field,
                  fields,
                })
              )
            F.off(modal)()
          }}
        />
      </theme.Modal>
      <theme.Popover
        open={popover}
        arrow={false}
        position="bottom center"
        style={{ width: 'auto' }}
      >
        {!_.isEmpty(typeOptions) && (
          <>
            <theme.DropdownItem className="filter-actions-selected-type">
              Filter type: <strong>{getTypeLabel(tree, node.type)}</strong>
            </theme.DropdownItem>
            {_.map(
              (x) => (
                <theme.DropdownItem
                  key={x.value}
                  onClick={() =>
                    tree.replace(
                      node.path,
                      newNodeFromType(x.value, fields, node)
                    )
                  }
                >
                  —Change to {x.label}
                </theme.DropdownItem>
              ),
              getTypeLabelOptions(tree, typeOptions)
            )}
            <div className="filter-actions-separator" />
          </>
        )}
        <theme.DropdownItem onClick={F.on(modal)}>
          Pick Field
        </theme.DropdownItem>
        {/* If only contexture-client diffed the tree before sending a request... */}
        {(node.hasValue || false) && (
          <theme.DropdownItem onClick={() => tree.clear(node.path)}>
            Clear Filter
          </theme.DropdownItem>
        )}
        <theme.DropdownItem onClick={() => tree.remove(node.path)}>
          Delete Filter
        </theme.DropdownItem>
      </theme.Popover>
    </>
  )
})

export let Label = observer(function Label({
  tree,
  node,
  path,
  fields,
  children,
  theme,
  ...props
}) {
  node = useNode(node, path, tree)
  theme = useTheme(theme)
  let popover = React.useState(false)
  let modal = React.useState(false)
  let field = _.get('field', node)
  return (
    <Flex
      className={`filter-field-label ${
        _.get('hasValue', node) ? 'filter-field-has-value' : ''
      }`.trim()}
      style={{
        cursor: 'pointer',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <span {...props}>
        {children || _.get([field, 'label'], fields) || field || ''}
      </span>
      {tree && node && (
        <>
          <span
            onClick={
              node.paused
                ? null
                : (e) => {
                    e.stopPropagation()
                    F.flip(popover)()
                  }
            }
          >
            <span className="filter-field-label-icon">
              <theme.Icon icon="TableColumnMenu" />
            </span>
            <FilterActions
              node={node}
              tree={tree}
              path={path}
              fields={fields}
              popover={popover}
              modal={modal}
            />
          </span>
          {
            // Whitespace separator
            <div style={{ flexGrow: 1 }} />
          }
        </>
      )}
    </Flex>
  )
})

export default observer(function FilterList({
  tree,
  node,
  path,
  fields,
  resultsPath,
  mapNodeToProps = _.noop,
  mapNodeToLabel = _.noop,
  className,
  style,
  theme,
}) {
  node = useNode(node, path, tree)
  theme = useTheme(theme)
  // find results node that this filter node is targeting (['root', 'results'])
  let updateRequired =
    tree.disableAutoUpdate && tree.getNode(resultsPath)?.markedForUpdate
  return (
    <div style={style} className={className}>
      {_.map(
        (child) =>
          child.children ? (
            <FilterList
              key={child.path}
              tree={tree}
              node={child}
              fields={fields}
              mapNodeToProps={mapNodeToProps}
              mapNodeToLabel={mapNodeToLabel}
              className={'filter-list-group'}
              style={bdJoin(child)}
            />
          ) : (
            <Expandable
              key={child.path}
              className="filter-list-item"
              isOpen={!child.paused}
              Label={
                <Label tree={tree} node={child} fields={fields}>
                  {mapNodeToLabel(child, fields)}
                </Label>
              }
              onClick={() =>
                tree && tree.mutate(child.path, { paused: !child.paused })
              }
            >
              <div className="filter-list-item-contents">
                <Dynamic
                  {...{
                    component: theme.UnmappedNodeComponent,
                    tree,
                    node: child,
                    path: _.toArray(child.path),
                    ...mapNodeToProps(child, fields),
                  }}
                />
              </div>
            </Expandable>
          ),
        _.get('children', node)
      )}
      <div
        className={`apply-filter ${updateRequired ? 'active' : ''}`}
        onClick={(e) => {
          e.stopPropagation()
          tree.triggerUpdate()
        }}
      >
        <theme.Button primary>
          <Flex justifyContent="center" alignItems="center">
            Search
          </Flex>
        </theme.Button>
      </div>
    </div>
  )
})
