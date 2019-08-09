import React from 'react'
import _ from 'lodash/fp'
import F from 'futil-js'
import { contexturify, defaultTheme } from '../utils/hoc'
import RadioList from '../layout/RadioList'

let Bool = _.flow(
  contexturify,
  defaultTheme({ RadioList })
)(({ tree, node, theme }) => (
  <div className="contexture-bool">
    <theme.RadioList
      value={node.value ? 'yes' : 'no'}
      onChange={value => {
        tree.mutate(node.path, { value: value === 'yes' })
      }}
      options={F.autoLabelOptions(['yes', 'no'])}
    />
  </div>
))
Bool.displayName = 'Bool'

export default Bool
