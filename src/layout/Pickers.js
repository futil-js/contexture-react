import F from 'futil-js'
import React from 'react'
import { observer } from 'mobx-react'
import { withStateLens } from '../utils/mobx-react-utils'
import { NestedPicker, Modal as DefaultModal } from './'

export let ModalPicker = withStateLens({ isOpen: false })(
  observer(
    ({
      options,
      isOpen,
      theme = {
        Button: 'button',
        Picker: NestedPicker,
        Modal: DefaultModal,
      },
      onChange,
      label,
    }) => (
      <div>
        <theme.Modal isOpen={isOpen}>
          <theme.Picker
            options={options}
            onChange={x => {
              onChange(x)
              F.off(isOpen)()
            }}
            theme={theme}
          />
        </theme.Modal>
        <theme.Button onClick={F.on(isOpen)}>{label}</theme.Button>
      </div>
    )
  )
)
ModalPicker.displayName = 'ModalPicker'
