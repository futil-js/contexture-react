import React from 'react'
import _ from 'lodash/fp'
import F from 'futil'
import { observer } from 'mobx-react'
import { Flex, Grid, Divider } from 'grey-vest'
import { withTheme } from '../../utils/theme'
import { getTag, tagTerm, tagValueField } from './utils'

let TagActionsMenu = ({
  tag,
  node,
  tree,
  theme: { Button, Checkbox, RadioList, Text },
}) => {
  let tagInstance = getTag(tag, node)
  return (
    <Grid
      gap="sm"
      className="tags-query-tag-actions-menu"
      style={{ minWidth: 200 }}
    >
      <Text small>
        {_.startCase(tagTerm)}: "{tag}"
      </Text>
      <Divider margin={0} style={{ marginLeft: -16, marginRight: -16 }} />
      {_.includes(' ', tag) && (
        <>
          <RadioList
            columnCount={2}
            options={F.autoLabelOptions(['fuzzy', 'exact'])}
            value={tagInstance.distance ? 'fuzzy' : 'exact'}
            onChange={value => {
              tagInstance.distance = value === 'fuzzy' ? 3 : 0
              tree.mutate(node.path, { tags: [...node.tags] })
            }}
          />
          <Button
            onClick={() => {
              tree.mutate(node.path, {
                tags: _.map(tag => {
                  if (_.includes(' ', tag[tagValueField]))
                    tag.distance = tagInstance.distance
                  return tag
                }, node.tags),
              })
            }}
          >
            Apply to all {tagTerm}s
          </Button>
        </>
      )}
      <Flex
        as="label"
        className="labeled-checkbox"
        alignItems="center"
        gap="sm"
      >
        <Checkbox
          checked={tagInstance.onlyShowTheseResults}
          onChange={checked => {
            tagInstance.onlyShowTheseResults = checked
            tree.mutate(node.path, { tags: [...node.tags] })
          }}
        />
        <Text small>Only view this {tagTerm}</Text>
      </Flex>
    </Grid>
  )
}

export default _.flow(
  observer,
  withTheme
)(TagActionsMenu)
