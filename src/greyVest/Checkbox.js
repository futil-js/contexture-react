import React from 'react'
import Icon from './Icon'

// Low effort custom checkbox
let Checkbox = React.forwardRef(
  ({ checked, onChange = () => {}, style = {} }, ref) => (
    <label
      className={`gv-input gv-checkbox ${checked ? 'checked' : ''}`}
      style={style}
      ref={ref}
    >
      <input
        type="checkbox"
        style={{ display: 'none' }}
        {...{ checked, onChange }}
      />
      {checked ? (
        <Icon icon="Check" />
      ) : (
        String.fromCharCode(160) // non-breaking space
      )}
    </label>
  )
)
export default Checkbox
