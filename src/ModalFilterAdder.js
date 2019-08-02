import _ from 'lodash/fp'
import FilterAdder from './FilterAdder'
import { ModalPicker, NestedPicker } from './layout/'
import { defaultProps } from 'recompose'
import { defaultTheme } from './utils/hoc'
/*
export default ({
  theme,
  label = 'Add Custom Filter',
} = {}) =>
  defaultProps({
    Picker: defaultProps({
      theme: {
        ...theme,
        Picker: defaultProps({ theme })(theme && theme.Picker || NestedPicker),
      },
      label,
    })(ModalPicker),
  })(FilterAdder)
*/

let DefaultPicker = defaultTheme({ Picker: NestedPicker })(ModalPicker)

export default _.compose(
  defaultProps({ label: 'Add Custom Filter' }),
  defaultTheme({ Picker: DefaultPicker })
)(FilterAdder)
