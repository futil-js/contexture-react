import React from 'react'
import _ from 'lodash/fp.js'
import F from 'futil'
import { observer } from 'mobx-react'
import { useNode, useTheme } from '../utils/hooks.js'
import { bgJoin } from '../styles/generic.js'
import TagsJoinPicker, { tagToGroupJoin } from './TagsJoinPicker.js'
import Flex from '../greyVest/Flex.js'

let operatorOptions = F.autoLabelOptions([
  { value: 'containsWord', label: 'Field Contains' },
  { value: 'wordStartsWith', label: 'Word Starts With' },
  { value: 'wordEndsWith', label: 'Word Ends With' },
  { value: 'containsExact', label: 'Word Is Exactly' },
  { value: 'startsWith', label: 'Field Starts With' },
  { value: 'endsWith', label: 'Field Ends With' },
  { value: 'is', label: 'Field Is Exactly' },
  // { value: 'isNot', label: 'Is Not' },
  // { value: 'contains', label: 'Contains'},
  // { value: 'doesNotContain', label: 'Does Not Contain'}
])

export default observer(function TagsText({
  tree,
  node,
  path,
  placeholder,
  theme,
}) {
  node = useNode(node, path, tree)
  theme = useTheme(theme)
  return (
    <theme.Loader loading={node.updating}>
      <div className="contexture-text">
        <theme.Select
          value={node.operator}
          onChange={(e) => tree.mutate(node.path, { operator: e.target.value })}
          options={operatorOptions}
        />
        <Flex className="tags-query">
          <theme.TagsInput
            splitCommas
            tags={node.values}
            addTags={(tags) => {
              tree.mutate(node.path, { values: [...node.values, ...tags] })
            }}
            removeTag={(tag) => {
              tree.mutate(node.path, {
                values: _.without([tag], node.values),
              })
            }}
            tagStyle={bgJoin(tagToGroupJoin(node.join))}
            submit={tree.triggerUpdate}
            placeholder={placeholder}
            style={{ flex: 1, border: 0 }}
          />
          <div style={{ paddingTop: 4 }}>
            <theme.Popover
              trigger={
                <div>
                  <theme.Icon icon="TableColumnMenu" />
                </div>
              }
              position="bottom right"
              closeOnPopoverClick={false}
              style={{ width: 240 }}
            >
              <TagsJoinPicker node={node} tree={tree} />
            </theme.Popover>
          </div>
        </Flex>
      </div>
    </theme.Loader>
  )
})
