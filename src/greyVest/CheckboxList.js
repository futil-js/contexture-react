import React from 'react'
import _ from 'lodash/fp'
import F from 'futil'
import Checkbox from './Checkbox'

let CheckboxList = ({ value, onChange, options, ...props }) => (
  <div {...props}>
    {_.map(
      option => (
        <label
          key={option.value}
          style={{ display: 'flex', cursor: 'pointer', marginRight: 25 }}
        >
          <Checkbox
            value={_.includes(option.value, value)}
            onChange={e => {
              let x = e.target.value
              onChange(
                x ? F.push(option.value, value) : _.pull(option.value, value)
              )
            }}
          />
          <div style={{ paddingLeft: 15 }}>{option.label}</div>
        </label>
      ),
      options
    )}
  </div>
)

export default CheckboxList
