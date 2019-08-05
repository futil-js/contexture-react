import F from 'futil-js'
import _ from 'lodash/fp'
import React from 'react'
import { observer } from 'mobx-react'
import { withStateLens } from '../utils/mobx-react-utils'
import NestedPicker from './NestedPicker'
import Modal from './Modal'
import { defaultTheme } from '../utils/hoc'

let ModalPicker = _.flow(
  withStateLens({ isOpen: false }),
  observer,
  defaultTheme({
    Button: 'button',
    Picker: NestedPicker,
    Modal,
  })
)(({ options, isOpen, theme, onChange, label }) => (
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
))
ModalPicker.displayName = 'ModalPicker'

export default ModalPicker
