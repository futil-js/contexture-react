import React from 'react'
import List from '../../layout/List'
import { Flex } from '../../layout/Flex'

let ErrorBlock = ({ children, ...props }) => (
  <Flex className="gv-block-error" alignItems="center" {...props}>
    <i className="material-icons" style={{ marginRight: 8 }}>
      warning
    </i>
    <List>
      {children}
    </List>
  </Flex>
)
export default ErrorBlock
