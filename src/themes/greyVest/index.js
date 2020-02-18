import { defaultProps } from '../../utils/react'

// components exported from component library
import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  CheckboxList,
  DateInput,
  Dropdown,
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
  Text,
  Subtitle,
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
  Dropdown,
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
  Text,
  Title: defaultProps({ large: true })(Subtitle),
}
