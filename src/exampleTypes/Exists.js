import React from 'react'
import _ from 'lodash/fp'
import F from 'futil-js'
import { contexturify, defaultTheme } from '../utils/hoc'
import RadioList from '../layout/RadioList'

let Exists = _.flow(
  contexturify,
  defaultTheme({ RadioList }),
)(({ tree, node, theme }) => (
  <div className="contexture-exists">
    <theme.RadioList
      value={node.value ? 'exists' : 'doesNotExist'}
      onChange={value => {
        tree.mutate(node.path, { value: value === 'exists' })
      }}
      options={F.autoLabelOptions(['exists', 'doesNotExist'])}
    />
  </div>
))
Exists.displayName = 'Exists'

export default Exists
