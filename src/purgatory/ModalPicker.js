import F from 'futil'
import React from 'react'
import { observer } from 'mobx-react'
import { useTheme } from '../utils/hooks.js'

let ModalPicker = ({
  options = [],
  className = '',
  modalClassName = '',
  onChange,
  label,
  theme,
  ...props
}) => {
  let { Button, NestedPicker, Modal } = useTheme(theme)
  let open = React.useState(false)
  return (
    !!options.length && (
      <>
        <Modal open={open} className={modalClassName}>
          <NestedPicker
            options={options}
            onChange={(x) => {
              onChange(x)
              F.off(open)()
            }}
            {...props}
          />
        </Modal>
        <Button
          className={`modal-picker-button ${className}`}
          onClick={F.on(open)}
        >
          {label}
        </Button>
      </>
    )
  )
}

export default observer(ModalPicker)
