import { defaultProps } from '../../utils/react'

// components exported from component library
import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  CheckboxList,
  DateInput,
  DropdownItem,
  NestedPicker,
  Modal,
  PagerItem,
  RadioList,
  Select,
  Table,
  Tag,
  TagsInput,
  IconButton,
  TextHighlight,
  TextInput,
} from 'grey-vest'

//components used only for theme
import Icon from './Icon'
import PickerItem from './PickerItem'
import Root from './Root'

export default {
  AlternateButton: defaultProps({ Icon })(IconButton),
  Box,
  Button: defaultProps({ Icon })(Button),
  ButtonGroup,
  Checkbox,
  CheckboxList,
  DateInput,
  Root,
  Icon,
  TextInput,
  DropdownItem,
  NestedPicker: defaultProps({ PickerItem })(NestedPicker),
  NumberInput: defaultProps({ type: 'number' })(TextInput),
  TagsInput,
  Tag,
  Modal,
  PagerItem,
  RadioList,
  Select,
  Table,
  TextHighlight,
}
