import React from 'react'
import _ from 'lodash/fp.js'
import { observer } from 'mobx-react'
import { useNode, useTheme } from '../utils/hooks.js'

let getValue = (value) => (_.isNil(value) ? null : !!value)

export default observer(function BooleanType({
  tree,
  node,
  path,
  display = (value) => (_.isNil(value) ? 'Either' : value ? 'Yes' : 'No'),
  className = 'contexture-bool',
  theme,
}) {
  node = useNode(node, path, tree)
  theme = useTheme(theme)
  return (
    <theme.Loader loading={node.updating}>
      <div className={className}>
        <theme.RadioList
          value={getValue(node.value)}
          onChange={(value) => {
            tree.mutate(node.path, {
              value: getValue(value),
            })
          }}
          options={[
            { label: display(true), value: true },
            { label: display(false), value: false },
            { label: display(null), value: null },
          ]}
        />
      </div>
    </theme.Loader>
  )
})
