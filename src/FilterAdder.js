import _ from 'lodash/fp.js'
import React from 'react'
import { observer } from 'mobx-react'
import { newNodeFromField } from './utils/search.js'
import { ModalPicker } from './purgatory/index.js'
import { Flex } from './greyVest/index.js'
import { fieldsToOptions } from './utils/fields.js'
import { useTheme, useNode } from './utils/hooks.js'

let getGroupFields = (node) => _.map('field', _.getOr([], 'children', node))

export let unusedOptions = (fields, node) =>
  _.reject(
    (x) => _.includes(x.field, getGroupFields(node)),
    fieldsToOptions(fields)
  )

let DefaultPicker = (props) => (
  <ModalPicker modalClassName="filter-adder" {...props} />
)

let FilterAdder = ({
  tree,
  node,
  path,
  fields,
  uniqueFields,
  Picker = DefaultPicker,
  theme,
  ...props
}) => {
  node = useNode(node, path, tree)
  let { Icon } = useTheme(theme)
  let options = uniqueFields
    ? unusedOptions(fields, node)
    : fieldsToOptions(fields)
  let Label = (
    <Flex justifyContent="center" alignItems="center">
      Add Custom Filter
      <Icon style={{ paddingLeft: 5 }} icon="FilterAdd" />
    </Flex>
  )
  return (
    <Picker
      options={options}
      onChange={(changes) => {
        if (!_.isEmpty(changes)) {
          _.each(
            ({ field }) => tree.add(path, newNodeFromField({ field, fields })),
            changes
          )
        }
      }}
      label={Label}
      {...props}
    />
  )
}

export default observer(FilterAdder)
