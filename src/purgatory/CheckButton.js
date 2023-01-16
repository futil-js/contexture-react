import _ from 'lodash/fp.js'
import React from 'react'
import { Flex } from '../greyVest/index.js'
import { useTheme } from '../utils/hooks.js'

let CheckButton = ({
  theme,
  checked = false,
  onClick,
  children,
  className,
  ...props
}) => {
  let { Checkbox, Button } = useTheme(theme)
  return (
    <Button
      onClick={onClick}
      className={`check-button ${className || ''}`}
      {...props}
    >
      <Flex alignItems="center" justifyContent="center">
        <Checkbox
          checked={!!checked} // prevent react "uncontrolled component" warning when `checked` prop is undefined
          onChange={_.noop} // prevent another react warning when `checked` is passed but `onChange` isn't
          disabled
        />
        &nbsp; {children}
      </Flex>
    </Button>
  )
}

export default CheckButton
