import React from 'react'
import {
  BarChart,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  DateInput,
  Icon,
  DropdownItem,
  NestedPicker as GVNestedPicker,
  Modal,
  PagerItem,
  RadioList,
  Select,
  Table,
  TextButton,
  TextHighlight,
  TextInput,
  Popover,
  StripedLoader,
} from '../../greyVest/index.js'
import PickerItem from './PickerItem.js'
import TagsInput, { Tag } from './TagsInput.js'
import Root from './Root.js'
import UnmappedNodeComponent from './UnmappedNodeComponent.js'

export default {
  AlternateButton: TextButton,
  BarChart,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  DateInput,
  FilterButton: Button,
  Root,
  Loader: StripedLoader,
  Icon,
  TextInput,
  DropdownItem,
  NestedPicker: function NestedPicker(props) {
    return <GVNestedPicker PickerItem={PickerItem} {...props} />
  },
  NumberInput: function NumberInput(props) {
    return <TextInput type="number" {...props} />
  },
  TagsInput,
  Tag,
  Modal,
  PagerItem,
  RadioList,
  Select,
  Table,
  TextHighlight,
  Popover,
  Tbody: 'tbody',
  Td: 'td',
  TextButton: 'button',
  Tfoot: 'tfoot',
  Th: 'th',
  Thead: 'thead',
  Tr: 'tr',
  UnmappedNodeComponent,
}
