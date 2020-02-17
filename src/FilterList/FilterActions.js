import React from 'react'
import _ from 'lodash/fp'
import F from 'futil'
import { observer } from 'mobx-react'
import { Popover, Divider } from 'grey-vest'
import { fieldsToOptions } from '../FilterAdder'
import {
  newNodeFromType,
  transformNodeFromField,
  getTypeLabel,
  getTypeLabelOptions,
} from '../utils/search'
import { withTheme } from '../utils/theme'

let FilterActions = ({
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
        triggerProps={{ small: true, icon: 'TableColumnMenu' }}
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

export default _.flow(
  observer,
  withTheme
)(FilterActions)
