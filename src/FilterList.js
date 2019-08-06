import React from 'react'
import _ from 'lodash/fp'
import F from 'futil-js'
import { observer, inject } from 'mobx-react'
import { Flex, Dynamic, Popover, Modal, NestedPicker } from './layout'
import { fieldsToOptions } from './FilterAdder'
import { withStateLens } from './utils/mobx-react-utils'
import { contexturify, defaultTheme } from './utils/hoc'
import DefaultIcon from './DefaultIcon'
import DefaultMissingTypeComponent from './DefaultMissingTypeComponent'
import { bdJoin } from './styles/generic'
import {
  newNodeFromType,
  transformNodeFromField,
  getTypeLabel,
  getTypeLabelOptions,
} from './utils/search'

export let FilterActions = _.flow(
  observer,
  withStateLens({ modal: false }),
  defaultTheme({
    Modal,
    Picker: NestedPicker,
    Popover,
    Item: 'li',
  }),
)(({ node, tree, fields, theme, popover, modal }) => {
  let typeOptions = _.flow(
    _.getOr([], [node.field, 'typeOptions']),
    _.without([node.type])
  )(fields)

  return (
    <>
      <theme.Modal isOpen={modal}>
        <theme.Picker
          options={fieldsToOptions(fields)}
          onChange={field => {
            tree.replace(node.path, transformNodeFromField({ field, fields }))
            F.off(modal)()
          }}
        />
      </theme.Modal>
      <theme.Popover isOpen={popover} className="filter-actions-popover">
        {!_.isEmpty(typeOptions) && (
          <>
            <theme.Item className="filter-actions-selected-type">
              Filter type: <strong>{getTypeLabel(tree, node.type)}</strong>
            </theme.Item>
            {_.map(
              x => (
                <theme.Item
                  key={x.value}
                  onClick={() =>
                    tree.replace(
                      node.path,
                      newNodeFromType(x.value, fields, node)
                    )
                  }
                >
                  —Change to {x.label}
                </theme.Item>
              ),
              getTypeLabelOptions(tree, typeOptions)
            )}
            <div className="filter-actions-separator" />
          </>
        )}
        <theme.Item onClick={F.on(modal)}>Pick Field</theme.Item>
        {/* If only contexture-client diffed the tree before sending a request... */}
        {(node.hasValue || false) && (
          <theme.Item onClick={() => tree.clear(node.path)}>
            Clear Filter
          </theme.Item>
        )}
        <theme.Item onClick={() => tree.remove(node.path)}>
          Delete Filter
        </theme.Item>
      </theme.Popover>
    </>
  )
})
FilterActions.displayName = 'FilterActions'

export let Label = _.flow(
  contexturify,
  defaultTheme({ Icon: DefaultIcon }),
  withStateLens({ popover: false, modal: false }),
)(({ tree, node, fields, theme, popover, modal, ...props }) => (
  <Flex
    className={`filter-field-label ${
      _.get('hasValue', node) ? 'filter-field-has-value' : ''
    }`.trim()}
    style={{
      cursor: 'pointer',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
    onClick={() =>
      tree && node && tree.mutate(node.path, { paused: !node.paused })
    }
  >
    <span {...props} />
    {tree && node && (
      <React.Fragment>
        <span
          onClick={e => {
            e.stopPropagation()
            F.flip(popover)()
          }}
        >
          <theme.Icon icon="TableColumnMenu" />
          <FilterActions {...{ node, tree, fields, popover, modal, theme }} />
        </span>
        {
          // Whitespace separator
          <div style={{ flexGrow: 1 }} />
        }
        {!node.updating &&
          tree.disableAutoUpdate &&
          // find if any nodes in the tree are marked for update (i.e. usually nodes are marked for update because they react to "others" reactor)
          _.some(
            treeNode => treeNode !== node && treeNode.markedForUpdate,
            F.treeToArray(_.get('children'))(tree.tree)
          ) && (
            <div
              className="filter-field-icon-refresh"
              onClick={e => {
                e.stopPropagation()
                tree.triggerUpdate()
              }}
            >
              <theme.Icon icon="Refresh" />
            </div>
          )}
        <div className="filter-field-label-icon">
          <theme.Icon
            icon={node.paused ? 'FilterListExpand' : 'FilterListCollapse'}
          />
        </div>
      </React.Fragment>
    )}
  </Flex>
))
Label.displayName = 'Label'

export let FieldLabel = contexturify(
  ({ tree, node, node: { field } = {}, fields, theme, label }) => (
    <Label {...{ tree, node, theme, fields }}>
      {label || _.get([field, 'label'], fields) || field}
    </Label>
  )
)
FieldLabel.displayName = 'FieldLabel'

export let FilterList = _.flow(
  contexturify,
  defaultTheme({
    MissingTypeComponent: DefaultMissingTypeComponent,
  }),
)(
  ({
    tree,
    node,
    typeComponents: types = {},
    fields,
    mapNodeToProps = _.noop,
    mapNodeToLabel = _.noop,
    theme,
    className,
    style,
  }) => (
    <div style={style} className={className}>
      {_.map(
        child =>
          child.children ? (
            <FilterList
              key={child.path}
              tree={tree}
              node={child}
              typeComponents={types}
              fields={fields}
              mapNodeToProps={mapNodeToProps}
              mapNodeToLabel={mapNodeToLabel}
              theme={theme}
              className={'filter-list-group'}
              style={bdJoin(child)}
            />
          ) : (
            <div key={child.path} className="filter-list-item">
              <FieldLabel
                tree={tree}
                node={child}
                fields={fields}
                theme={theme}
                label={mapNodeToLabel(child, fields, types)}
              />
              {!child.paused && (
                <div className="filter-list-item-contents">
                  <Dynamic
                    component={types[child.type] || theme.MissingTypeComponent}
                    theme={theme}
                    tree={tree}
                    node={child}
                    path={_.toArray(child.path)}
                    {...mapNodeToProps(child, fields, types)}
                  />
                </div>
              )}
            </div>
          ),
        _.get('children', node)
      )}
    </div>
  )
)
FilterList.displayName = 'FilterList'
