import React from 'react'
import { loading } from '../styles/generic'

let StripedLoader = (style = {}) => Component => ({
  isLoading = false,
  ...props
}) => (
  <div style={{ ...style, ...(isLoading && loading) }}>
    <Component {...props} />
  </div>
)
StripedLoader.displayName = 'StripedLoader'

export default StripedLoader
