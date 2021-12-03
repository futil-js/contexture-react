import React from 'react'
import { observer } from 'mobx-react'
import { loading as loadingStyle } from '../styles/generic'

let StripedLoader = ({ loading, style = {}, children }) => (
  <div
    data-testid="div-stripedLoader"
    style={{ ...style, ...(loading && loadingStyle) }}
  >
    {children}
  </div>
)

export default observer(StripedLoader)
