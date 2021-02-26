import React from 'react'
import { observer } from 'mobx-react'
import { Flex } from '../../greyVest'
import Icon from '../../greyVest/Icon'

let PickerItem = ({ active, disabled, hasChildren, children, ...props }) => (
  <div
    style={{
      padding: '10px 40px',
      cursor: 'pointer',
      fontSize: 18,
      background: active ? '#ebebeb' : '#fff',
      color: disabled ? '#9b9b9b' : '#000',
    }}
    {...props}
  >
    {hasChildren ? (
      <Flex style={{ alignItems: 'center' }}>
        {children}
        <Icon icon="MoveRight" />
      </Flex>
    ) : (
      children
    )}
  </div>
)

export default observer(PickerItem)
