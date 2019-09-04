import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { NestedPicker } from '../../src'

storiesOf('Components (Grey Vest)|NestedPicker', module).addWithJSX(
  'NestedPicker',
  () => (
    <NestedPicker
      options={['abcd', 'bcde', 'cdef'].map(x => ({ label: x, value: x }))}
      onChange={action(`picked`)}
    />
  )
)