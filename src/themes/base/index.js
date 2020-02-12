import F from 'futil'
import React from 'react'
// components exported from base component library
import {
  BarChart,
  CheckboxList,
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

import { defaultProps } from '../../utils/react'
import { defaultTheme } from '../../utils/theme'

let native = defaultProps({ native: true })

let Checkbox = props => <input type="checkbox" {...props} />

let theme = {
  AlternateButton: 'button',
  BarChart,
  Box: 'div',
  Button: 'button',
  ButtonGroup: 'div',
  Checkbox,
  CheckboxList: defaultProps({ Checkbox })(CheckboxList),
  DateInput: native(DateInput),
  UnmappedNodeComponent,
  Icon,
  Input: 'input',
  Dropdown: Popover,
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
