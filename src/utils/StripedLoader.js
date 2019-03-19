import React from 'react'
import { observer } from 'mobx-react'
import { loading } from '../styles/generic'

let StripedLoader = Component =>
  observer(({ loaderStyle = {}, ...props }) => (
    <div
      style={{
        ...loaderStyle,
        ...(props.node && props.node.updating && loading),
      }}
    >
      <Component {...props} />
    </div>
  ))
StripedLoader.displayName = 'StripedLoader'

export default StripedLoader
