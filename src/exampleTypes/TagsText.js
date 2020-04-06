import React from 'react'
import _ from 'lodash/fp'
import F from 'futil'
import { Flex } from 'grey-vest'
import { contexturify } from '../utils/hoc'
import { bgJoin } from '../styles/generic'

import TagsJoinPicker, { tagToGroupJoin } from './TagsJoinPicker'

let operatorOptions = F.autoLabelOptions([
  { value: 'containsWord', label: 'Field contains' },
  { value: 'wordStartsWith', label: 'Word starts with' },
  { value: 'wordEndsWith', label: 'Word ends with' },
  { value: 'containsExact', label: 'Word is exactly' },
  { value: 'startsWith', label: 'Field starts with' },
  { value: 'endsWith', label: 'Field ends with' },
  { value: 'is', label: 'Field is exactly' },
  // { value: 'isNot', label: 'Is Not' },
  // { value: 'contains', label: 'Contains'},
  // { value: 'doesNotContain', label: 'Does Not Contain'}
])

let Text = ({
  tree,
  node,
  placeholder = 'Search...',
  theme: { Select, TagsInput, Popover },
}) => {
  let open = React.useState(false)
  let [selectedTag, setSelectedTag] = React.useState(null)
  return (
    <Flex className="contexture-text" column gap="sm">
      <Select
        {...F.domLens.value(tree.lens(node.path, 'operator'))}
        options={operatorOptions}
      />
      <TagsInput
        splitCommas
        tags={node.values}
        onTagClick={tag => {
          F.on(open)()
          setSelectedTag(tag)
        }}
        addTag={tag => {
          tree.mutate(node.path, { values: [...node.values, tag] })
        }}
        removeTag={tag => {
          tree.mutate(node.path, {
            values: _.without([tag], node.values),
          })
        }}
        tagStyle={bgJoin(tagToGroupJoin(node.join))}
        submit={tree.triggerUpdate}
        placeholder={placeholder}
      />
      <Popover open={open}>
        <TagsJoinPicker tag={selectedTag} node={node} tree={tree} />
      </Popover>
    </Flex>
  )
}

export default contexturify(Text)
