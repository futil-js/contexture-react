import React from 'react'
import { observer } from 'mobx-react'
import F from 'futil-js'

let LensInput = observer(({ lens, theme, ...x }) => (
  <theme.Input {...F.domLens.value(lens)} {...x} />
))
LensInput.displayName = 'LensInput'

export default LensInput
