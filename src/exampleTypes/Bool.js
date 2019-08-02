import React from 'react'
import F from 'futil-js'
import { contexturify, defaultTheme } from '../utils/hoc'
import RadioListDefault from '../layout/RadioList'

let Bool = defaultTheme({ RadioList: RadioListDefault })(({ tree, node, theme }) => (
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

export default contexturify(Bool)
