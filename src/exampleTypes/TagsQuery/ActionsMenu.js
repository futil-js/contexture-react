import React from 'react'
import _ from 'lodash/fp'
import F from 'futil'
import { observer } from 'mobx-react'
import TagsJoinPicker from '../TagsJoinPicker'
import { withTheme } from '../../utils/theme'
import { Flex, Grid, Popover, Divider } from 'grey-vest'
import { copyTags, tagTerm } from './utils'

let ActionsMenu = ({
  node,
  tree,
  open,
  theme: { Button, Checkbox, AlternateButton },
  actionWrapper = _.identity,
}) => (
  <Popover
    placement="bottom-end"
    keepOpen
    Trigger={AlternateButton}
    triggerProps={{ icon: 'TableColumnMenu' }}
    open={open}
  >
    <Grid
      className="tags-query-actions-menu"
      gap="sm"
      style={{ minWidth: 240 }}
    >
      {!!_.get('tags.length', node) && (
        <>
          <Button
            onClick={actionWrapper(() => F.off(open)() || copyTags(node))}
          >
            Copy {_.startCase(tagTerm)}s
          </Button>
          <Button
            onClick={actionWrapper(
              () => F.off(open)() || tree.mutate(node.path, { tags: [] })
            )}
          >
            Clear {_.startCase(tagTerm)}s
          </Button>
          <Divider margin={0} style={{ marginLeft: -16, marginRight: -16 }} />
        </>
      )}
      <Flex as="label" gap="sm" alignItems="center">
        <Checkbox
          htmlId="stemming"
          checked={!node.exact}
          onChange={checked => tree.mutate(node.path, { exact: !checked })}
        />
        <span>Include word variations</span>
      </Flex>
      <TagsJoinPicker node={node} tree={tree} />
    </Grid>
  </Popover>
)

export default _.flow(
  observer,
  withTheme
)(ActionsMenu)
