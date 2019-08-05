import _ from 'lodash/fp'
import React from 'react'
import { observer } from 'mobx-react'
import Picker from './layout/NestedPicker'
import { defaultTheme, withOptionalNode, withLoader } from './utils/hoc'
import { newNodeFromField } from './utils/search'

export let fieldsToOptions = _.map(x => ({ value: x.field, ...x }))

let getGroupFields = node => _.map('field', _.getOr([], 'children', node))

let FilterAdder = _.flow(
  observer,
  defaultTheme({ Picker }),
  withOptionalNode,
  withLoader
)(({ tree, node, path, fields, theme, uniqueFields }) => {
  let options = fieldsToOptions(fields)
  if (uniqueFields) {
    options = _.reject(x => _.includes(x.field, getGroupFields(node)), options)
  }
  return (
    <>
      TEST
      <theme.Picker
        options={options}
        onChange={field => tree.add(path, newNodeFromField({ field, fields }))}
      />
    </>
  )
})
FilterAdder.displayName = 'FilterAdder'

export default FilterAdder
