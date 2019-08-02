import FilterAdder from './FilterAdder'
import { ModalPicker, NestedPicker } from './layout/'
import { defaultProps } from 'recompose'

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
