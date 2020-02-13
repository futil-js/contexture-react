import React from 'react'
import _ from 'lodash/fp'
import F from 'futil'
import { setDisplayName } from 'recompose'
import { observer } from 'mobx-react'
import { Flex, Dynamic, Popover, Divider } from 'grey-vest'
import { fieldsToOptions } from './FilterAdder'
import { contexturifyWithoutLoader } from './utils/hoc'
import { bdJoin } from './styles/generic'
import {
  newNodeFromType,
  transformNodeFromField,
  getTypeLabel,
  getTypeLabelOptions,
} from './utils/search'
import { withTheme } from './utils/theme'

export let FilterActions = _.flow(
  setDisplayName('FilterActions'),
  observer,
  withTheme
)(
  ({
    node,
    tree,
    fields,
    theme: { DropdownItem, AlternateButton, Modal, NestedPicker },
  }) => {
    let modal = React.useState(false)
    let typeOptions = _.flow(
      _.getOr([], [node.field, 'typeOptions']),
      _.without([node.type])
    )(fields)
    return (
      <>
        <Modal open={modal}>
          <NestedPicker
            options={fieldsToOptions(fields)}
            onChange={field => {
              tree.replace(node.path, transformNodeFromField({ field, fields }))
              F.off(modal)()
            }}
          />
        </Modal>
        <Popover
          Trigger={AlternateButton}
          popupProps={{ padding: 0 }}
          triggerProps={{ small: true, icon: 'TableColumnMenu', onClick: e => e.stopPropagation() }}
        >
          {!_.isEmpty(typeOptions) && (
            <>
              <DropdownItem>
                Filter type: <strong>{getTypeLabel(tree, node.type)}</strong>
              </DropdownItem>
              {_.map(
                x => (
                  <DropdownItem
                    key={x.value}
                    onClick={() =>
                      tree.replace(
                        node.path,
                        newNodeFromType(x.value, fields, node)
                      )
                    }
                  >
                    —Change to {x.label}
                  </DropdownItem>
                ),
                getTypeLabelOptions(tree, typeOptions)
              )}
              <Divider />
            </>
          )}
          <DropdownItem onClick={F.on(modal)}>Pick Field</DropdownItem>
          {/* If only contexture-client diffed the tree before sending a request... */}
          {!!node.hasValue && (
            <DropdownItem onClick={() => tree.clear(node.path)}>
              Clear Filter
            </DropdownItem>
          )}
          <DropdownItem onClick={() => tree.remove(node.path)}>
            Delete Filter
          </DropdownItem>
        </Popover>
      </>
    )
  }
)

export let Label = _.flow(
  setDisplayName('Label'),
  observer,
  withTheme
)(({ tree, node, fields, children, theme: { Icon, Text }, ...props }) => {
  let field = _.get('field', node)
  return (
    <Flex
      className={F.compactJoin(' ', [
        'filter-field-label',
        node.hasValue && 'filter-field-has-value',
      ])}
      style={{ padding: 8, cursor: 'pointer' }}
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
        <FilterActions {...{ node, tree, fields }} />
      </Flex>
      {tree && node && (
        <Icon icon={node.paused ? 'FilterListExpand' : 'FilterListCollapse'} />
      )}
    </Flex>
  )
})

// we can't do this on export because FilterList is used internally
let FilterList = _.flow(
  setDisplayName('FilterList'),
  contexturifyWithoutLoader
)(
  ({
    tree,
    node,
    fields,
    mapNodeToProps = _.noop,
    mapNodeToLabel = _.noop,
    theme: { UnmappedNodeComponent, Button },
    style,
    ...props
  }) => (
    <div style={{ ...style }} {...props}>
      {_.map(
        child =>
          child.children ? (
            <FilterList
              key={child.path}
              tree={tree}
              node={child}
              fields={fields}
              mapNodeToProps={mapNodeToProps}
              mapNodeToLabel={mapNodeToLabel}
              style={{
                borderLeft: '2px solid',
                ...bdJoin(child),
                paddingLeft: 4,
              }}
            />
          ) : (
            <div key={child.path}>
              <Label tree={tree} node={child} fields={fields}>
                {mapNodeToLabel(child, fields)}
              </Label>
              {!child.paused && (
                <Flex
                  column
                  gap={1}
                  style={{ padding: 8, paddingTop: 0, marginLeft: -4 }}
                >
                  <Dynamic
                    {...{
                      component: UnmappedNodeComponent,
                      tree,
                      node: child,
                      path: _.toArray(child.path),
                      ...mapNodeToProps(child, fields),
                    }}
                  />
                  {!child.updating &&
                    tree.disableAutoUpdate &&
                    // find if any nodes in the tree are marked for update (i.e. usually nodes are marked for update because they react to "others" reactor)
                    _.some(
                      treeNode => treeNode !== node && treeNode.markedForUpdate,
                      F.treeToArray(_.get('children'))(tree.tree)
                    ) && (
                      <Button
                        onClick={e => {
                          e.stopPropagation()
                          tree.triggerUpdate()
                        }}
                        compact
                        primary
                      >
                        Apply Filter
                      </Button>
                    )}
                </Flex>
              )}
              <Divider margin={0} />
            </div>
          ),
        _.get('children', node)
      )}
    </div>
  )
)

export default FilterList
