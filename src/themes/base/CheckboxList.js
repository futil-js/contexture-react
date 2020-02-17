import React from 'react'
import F from 'futil'
import _ from 'lodash/fp'
import { ColumnList, Flex } from 'grey-vest'

let CheckboxList = ({ options, value, onChange, ...props }) => (
  <ColumnList gap="sm" {...props}>
    {_.map(
      option => (
        <Flex
          as="label"
          alignItems="baseline"
          key={option.value}
          style={{ cursor: option.disabled ? 'not-allowed' : 'pointer' }}
        >
          <input
            type="checkbox"
            {...F.domLens.checkboxValues(option.value, [value, onChange])}
            style={{ marginRight: 8 }}
            {...option}
          />
          <span style={{ flex: 1, opacity: option.disabled && 0.5 }}>
            {option.label}
          </span>
        </Flex>
      ),
      options
    )}
  </ColumnList>
)

export default CheckboxList
