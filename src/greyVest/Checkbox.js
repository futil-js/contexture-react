import _ from 'lodash/fp'
import React from 'react'

// Low effort custom checkbox
let Checkbox = ({ value, onChange = () => {}, style = {} }) => (
  <label
    className={`gv-input gv-checkbox ${value ? 'checked' : ''}`}
    style={style}
  >
    <input
      type="checkbox"
      style={{ display: 'none' }}
      checked={value}
      onChange={e =>
        onChange(_.update('target.value', () => e.target.checked, e))
      }
    />
    {value ? (
      <i className="material-icons">check</i>
    ) : (
      String.fromCharCode(160) // non-breaking space
    )}
  </label>
)
export default Checkbox
