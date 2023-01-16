import React from 'react'
import Flex from './Flex.js'

let ButtonGroup = ({ className = 'gv-button-group', ...props }) => (
  <Flex className={className} {...props} />
)

export default ButtonGroup
