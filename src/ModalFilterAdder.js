import _ from 'lodash/fp'
import FilterAdder from './FilterAdder'
import { ModalPicker, NestedPicker } from './layout/'
import { defaultProps } from 'recompose'
import { defaultTheme } from './utils/hoc'

export default ({ label = 'Add Custom Filter', theme }) => {
  let PickerForModalPicker = theme && theme.Picker || NestedPicker
  let LabelledModalPicker = _.flow(
    defaultTheme({ Picker: PickerForModalPicker }),
    defaultProps({ label })
  )(ModalPicker)
  return defaultTheme({ Picker: LabelledModalPicker })(FilterAdder)
}