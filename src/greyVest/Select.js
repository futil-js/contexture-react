import React from 'react'
import { observer } from 'mobx-react'
import _ from 'lodash/fp'

let Select = ({ options, placeholder = 'Please Select...', ...props }, ref) => (
  <select
    data-testid="select-selectionBox"
    className="gv-input"
    {...props}
    ref={ref}
  >
    {placeholder && <option value="">{placeholder}</option>}
    {_.map(
      x => (
        <option
          data-testid={`option-optionChoice-${x.label}`}
          key={x.value}
          value={x.value}
        >
          {x.label}
        </option>
      ),
      options
    )}
  </select>
)

export default _.flow(React.forwardRef, observer)(Select)
