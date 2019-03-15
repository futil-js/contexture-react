import React from 'react'
import F from 'futil-js'
import { observer } from 'mobx-react'
import RadioListDefault from '../layout/RadioList'

export default observer(({ tree, node, RadioList = RadioListDefault }) => (
  <div className="contexture-bool">
    <RadioList
      value={node.value ? 'yes' : 'no'}
      onChange={value => {
        tree.mutate(node.path, { value: value === 'yes' })
      }}
      options={F.autoLabelOptions(['yes', 'no'])}
    />
  </div>
))
