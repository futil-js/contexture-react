import React from 'react'
import { observer } from 'mobx-react'
import { loading as loadingStyle } from '../styles/generic.js'

let StripedLoader = ({ node, style = {}, children }) => (
  <div style={{ ...style, ...(node.updating && loadingStyle) }}>{children}</div>
)

export default observer(StripedLoader)
