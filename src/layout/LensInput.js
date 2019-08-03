import React from 'react'
import { observer } from 'mobx-react'
import F from 'futil-js'
import { defaultTheme } from '../utils/hoc'

let LensInput = defaultTheme({ Input: 'input' })(
  observer(({ lens, theme, ...props }) => (
    <theme.Input {...F.domLens.value(lens)} {...props} />
  ))
)
LensInput.displayName = 'LensInput'

export default LensInput
