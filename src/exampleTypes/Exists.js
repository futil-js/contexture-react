import React from 'react'
import F from 'futil-js'
import { observer } from 'mobx-react'
import RadioListDefault from '../layout/RadioList'

export default observer(({ tree, node, RadioList = RadioListDefault }) => (
  <div className="contexture-exists">
    <RadioList
      value={node.value ? 'exists' : 'doesNotExist'}
      onChange={value => {
        tree.mutate(node.path, { value: value === 'exists' })
      }}
      options={F.autoLabelOptions(['exists', 'doesNotExist'])}
    />
  </div>
))
