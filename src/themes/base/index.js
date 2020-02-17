import F from 'futil'
import React from 'react'
import { defaultProps } from 'recompose'
// components exported from base component library
import {
  BarChart,
  Modal,
  NestedPicker,
  Popover,
  RadioList,
  Select,
  TagsInput,
  Tag,
  TextHighlight,
  DateInput,
} from 'grey-vest'

// components used only for base theme
import Icon from './Icon'
import UnmappedNodeComponent from './UnmappedNodeComponent'

import { defaultTheme } from '../../utils/theme'

let native = defaultProps({ native: true })

let theme = {
  AlternateButton: 'button',
  BarChart,
  Box: 'div',
  Button: 'button',
  ButtonGroup: 'div',
  Checkbox: props => <input type="checkbox" {...props} />,
  DateInput: native(DateInput),
  UnmappedNodeComponent,
  Icon,
  Input: 'input',
  DropdownItem: 'li',
  Modal,
  NumberInput: props => <input type="number" {...props} />,
  NestedPicker,
  PagerItem: ({ children }) => <span>{children}</span>,
  Popover,
  RadioList: native(RadioList),
  Select: native(Select),
  Table: 'table',
  Tag,
  TagsInput,
  TextHighlight,
  TextInput: 'input',
}
// To add `withTheme` components to the default theme, we have to mutate them onto
// the theme object after it's declared, because importing them into `utils/theme`
// before ThemeContext is initialized would cause dependency conflicts
F.mergeOn(defaultTheme, theme)
export default theme
