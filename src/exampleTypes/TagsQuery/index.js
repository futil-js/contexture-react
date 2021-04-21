import React from 'react'
import _ from 'lodash/fp'
import { Grid, GridItem, StripedLoader } from '../../greyVest'
import { contexturifyWithoutLoader } from '../../utils/hoc'
import { getTagStyle, tagValueField } from './utils'
import TagActionsMenu from './TagActionsMenu'
import ActionsMenu from './ActionsMenu'
import { observer } from 'mobx-react'
import { toNumber } from '../../utils/format'

export let innerHeight = 40

let TagsQuery = ({
  tree,
  node,
  style,
  actionWrapper,
  onAddTag = _.noop,
  popoverPosition = 'bottom right',
  popoverArrow,
  popoverOffsetY,
  Loader,
  theme: { Icon, TagsInput, Tag, Popover, Loader: ThemeLoader },
  joinOptions,
  ...props
}) => {
  Loader = Loader || ThemeLoader || StripedLoader
  let TagWithPopover = observer(props => {
    let result = _.get(['context', 'results', props.value], node)
    let tagProps = {
      ...props,
      ...(!_.isNil(result)
        ? { label: `${props.value} (${toNumber(result)})` }
        : {}),
      ...(node.updating
        ? {
            label: (
              <>
                {props.value}(
                <div
                  style={{
                    display: 'inline-block',
                    verticalAlign: 'middle',
                    margin: '0 .1rem',
                  }}
                >
                  <Loader
                    loading
                    style={{
                      height: '1rem',
                      width: '1.5rem',
                      minHeight: 'auto',
                    }}
                  />
                </div>
                )
              </>
            ),
          }
        : {}),
    }
    return (
      <Popover
        position="right top"
        closeOnPopoverClick={false}
        trigger={<Tag {...tagProps} />}
      >
        <TagActionsMenu tag={props.value} {...{ node, tree }} />
      </Popover>
    )
  })

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
      <GridItem place="center">
        <Popover
          style={{ width: 'auto' }}
          position={popoverPosition}
          arrow={popoverArrow}
          offsetY={popoverOffsetY}
          closeOnPopoverClick={false}
          trigger={
            <div>
              <Icon icon="TableColumnMenu" />
            </div>
          }
        >
          {close => (
            <ActionsMenu
              {...{
                node,
                tree,
                close,
                actionWrapper,
                joinOptions,
              }}
            />
          )}
        </Popover>
      </GridItem>
    </Grid>
  )
}

export default contexturifyWithoutLoader(TagsQuery)
