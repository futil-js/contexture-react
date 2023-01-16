import React from 'react'
import _ from 'lodash/fp.js'
import { observer } from 'mobx-react'
import { useNode, useTheme } from '../utils/hooks.js'

let getValue = (value) => (_.isNil(value) ? null : !!value)

let BooleanType = ({
  tree,
  node,
  path,
  display = (value) => (_.isNil(value) ? 'Either' : value ? 'Yes' : 'No'),
  className = 'contexture-bool',
  theme,
}) => {
  node = useNode(node, path, tree)
  let { Loader, RadioList } = useTheme(theme)
  return (
    <Loader node={node}>
      <div className={className}>
        <RadioList
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
    </Loader>
  )
}

export default observer(BooleanType)
