import _ from 'lodash/fp'
import React from 'react'
import { defaultTheme } from '../utils/hoc'
import { Flex } from './Flex'
import Checkbox from './Checkbox'

let CheckButton = defaultTheme({ Button: 'button', Checkbox })(
({
  theme,
  checked = false,
  onClick,
  children,
  ...props
}) => (
  <theme.Button onClick={onClick} {...props}>
    <Flex alignItems="center" justifyContent="center">
      <theme.Checkbox
        checked={!!checked} // prevent react "uncontrolled component" warning when `checked` prop is undefined
        onChange={_.noop} // prevent another react warning when `checked` is passed but `onChange` isn't
        disabled
      />
      {children}
    </Flex>
  </theme.Button>
))
export default CheckButton
