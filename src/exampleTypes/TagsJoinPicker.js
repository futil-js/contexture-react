import React from 'react'
import { observer } from 'mobx-react'
import _ from 'lodash/fp.js'
import { useNode, useTheme } from '../utils/hooks.js'

export let tagToGroupJoin = (x = 'any') =>
  ({
    any: 'or',
    all: 'and',
    none: 'not',
  }[x])

let getJoinOptions = _.intersectionWith(
  (defaultOption, option) => defaultOption.value === option,
  [
    { value: 'any', label: 'Match any of these keywords' },
    { value: 'all', label: 'Match all of these keywords' },
    { value: 'none', label: 'Match none of these keywords' },
  ]
)

export default observer(function TagsJoinPicker({
  node,
  tree,
  path,
  theme,
  joinOptions = ['any', 'all', 'none'],
}) {
  node = useNode(node, path, tree)
  theme = useTheme(theme)
  return (
    <theme.Select
      value={node.join}
      onChange={(e) => tree.mutate(node.path, { join: e.target.value })}
      options={getJoinOptions(joinOptions)}
      placeholder={false}
    />
  )
})
