import _ from 'lodash/fp'
import React from 'react'
import { observer } from 'mobx-react'
import { defaultTheme } from '../utils/hoc'
import Select from '../layout/Select'

export let tagToGroupJoin = (x = 'any') =>
  ({
    any: 'or',
    all: 'and',
    none: 'not',
  }[x])

let joinOptions = [
  { value: 'any', label: 'Match any of these keywords' },
  { value: 'all', label: 'Match all of these keywords' },
  { value: 'none', label: 'Match none of these keywords' },
]

let TagsJoinPicker = _.flow(
  observer,
  defaultTheme({ Select })
)(
  ({ node, tree, theme }) => (
    <theme.Select
      value={node.join}
      onChange={e => tree.mutate(node.path, { join: e.target.value })}
      options={joinOptions}
    />
  )
)
TagsJoinPicker.displayName = 'TagsJoinPicker'

export default observer(TagsJoinPicker)
