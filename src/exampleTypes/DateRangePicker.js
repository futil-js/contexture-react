import React from 'react'
import _ from 'lodash/fp.js'
import { observer } from 'mobx-react'
import { useNode, useTheme } from '../utils/hooks.js'

export default observer(function DateComponent({
  tree,
  path,
  node,
  ranges,
  theme,
}) {
  node = useNode(node, path, tree)
  theme = useTheme(theme)
  return (
    <theme.Loader loading={node.updating}>
      <theme.Select
        value={(_.find({ range: node.range }, ranges) || {}).label}
        onChange={(event) => {
          let value = _.get('target.value', event)
          if (value) {
            let { range } = _.find({ label: value }, ranges)
            tree.mutate(node.path, {
              range,
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            })
          }
        }}
        options={_.map((x) => ({ value: x.label, label: x.label }), ranges)}
      />
    </theme.Loader>
  )
})
