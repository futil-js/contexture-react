import React from 'react'
import _ from 'lodash/fp'
import { Grid, GridItem, Popover } from 'grey-vest'
import { contexturifyWithoutLoader } from '../../utils/hoc'
import { useLensObject } from '../../utils/react'
import { getTagStyle, tagValueField } from './utils'
import TagActionsMenu from './TagActionsMenu'
import ActionsMenu from './ActionsMenu'

export let innerHeight = 40

let TagsQuery = ({
  tree,
  node,
  style,
  popoverState,
  actionWrapper,
  onAddTag = _.noop,
  theme: { TagsInput, Tag },
  ...props
}) => {
  let newPopoverState = useLensObject({ open: false })
  popoverState = popoverState || newPopoverState

  let TagWithPopover = tagProps => (
    <Popover Trigger={Tag} triggerProps={tagProps}>
      <TagActionsMenu tag={tagProps.value} {...{ node, tree }} />
    </Popover>
  )

  return (
    <Grid
      className="tags-query"
      rows={`${innerHeight}px minmax(0, auto)`}
      columns="1fr auto"
      style={style}
    >
      <GridItem height={2} place="center stretch">
        <TagsInput
          splitCommas
          tags={_.map(tagValueField, node.tags)}
          addTag={tag => {
            tree.mutate(node.path, {
              tags: [...node.tags, { [tagValueField]: tag, distance: 3 }],
            })
            onAddTag(tag)
          }}
          removeTag={tag => {
            tree.mutate(node.path, {
              tags: _.reject({ [tagValueField]: tag }, node.tags),
            })
          }}
          tagStyle={getTagStyle(node, tagValueField)}
          submit={tree.triggerUpdate}
          Tag={TagWithPopover}
          style={{ flex: 1, border: 0 }}
          {...props}
        />
      </GridItem>
      <GridItem
        place="center"
        onClick={e => {
          // This is to prevent clicks on the button or inside the popup from
          // bubbling up to TagsQuerySearchBar and triggering an uncollapse,
          // which would rerender the component and reset the popover state.
          e.stopPropagation()
        }}
      >
        <ActionsMenu
          {...{
            node,
            tree,
            actionWrapper,
            open: popoverState.open,
          }}
        />
      </GridItem>
    </Grid>
  )
}

export default contexturifyWithoutLoader(TagsQuery)
