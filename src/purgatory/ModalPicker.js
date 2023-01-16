import F from 'futil'
import React from 'react'
import { observer } from 'mobx-react'
import { useTheme } from '../utils/hooks.js'

export default observer(function ModalPicker({
  options = [],
  className = '',
  modalClassName = '',
  onChange,
  label,
  theme,
  ...props
}) {
  theme = useTheme(theme)
  let open = React.useState(false)
  return (
    !!options.length && (
      <>
        <theme.Modal open={open} className={modalClassName}>
          <theme.NestedPicker
            options={options}
            onChange={(x) => {
              onChange(x)
              F.off(open)()
            }}
            {...props}
          />
        </theme.Modal>
        <theme.Button
          className={`modal-picker-button ${className}`}
          onClick={F.on(open)}
        >
          {label}
        </theme.Button>
      </>
    )
  )
})
