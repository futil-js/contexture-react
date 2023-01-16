import React from 'react'
import _ from 'lodash/fp.js'
import { observer } from 'mobx-react'
import TagsJoinPicker from '../TagsJoinPicker.js'
import { useTheme } from '../../utils/hooks.js'
import { Flex } from '../../greyVest/index.js'
import { copyTags, tagTerm } from './utils.js'

export default observer(function ActionsMenu({
  node,
  tree,
  close,
  theme,
  actionWrapper = _.identity,
  joinOptions,
}) {
  theme = useTheme(theme)
  return (
    <Flex
      style={{ minWidth: 240, padding: 10 }}
      className="tags-query-actions-menu"
      column
      justifyContent="stretch"
      alignItems="stretch"
    >
      {!!_.get('tags.length', node) && (
        <>
          <theme.Button
            onClick={actionWrapper(() => close() || copyTags(node))}
          >
            Copy {_.startCase(tagTerm)}s
          </theme.Button>
          <theme.Button
            style={{ margin: '10px 0' }}
            onClick={actionWrapper(
              () => close() || tree.mutate(node.path, { tags: [] })
            )}
          >
            Clear {_.startCase(tagTerm)}s
          </theme.Button>
          <div className="line-separator" />
        </>
      )}
      <label className="labeled-checkbox" style={{ margin: '10px 0' }}>
        <theme.Checkbox
          htmlId="stemming"
          checked={!node.exact}
          onChange={(e) => tree.mutate(node.path, { exact: !e.target.checked })}
        />
        <span>Include word variations</span>
      </label>
      <div>
        <TagsJoinPicker {...{ node, tree, joinOptions }} />
      </div>
    </Flex>
  )
})
