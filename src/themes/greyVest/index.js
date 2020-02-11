import { defaultProps } from 'recompose'

// components exported from component library
import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  DateInput,
  DropdownItem,
  NestedPicker,
  Modal,
  PagerItem,
  RadioList,
  Select,
  Table,
  IconButton,
  TextHighlight,
  TextInput,
} from 'grey-vest'

//components used only for theme
import Icon from './Icon'
import PickerItem from './PickerItem'
import TagsInput, { Tag } from './TagsInput'
import Root from './Root'

export default {
  AlternateButton: IconButton,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
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
