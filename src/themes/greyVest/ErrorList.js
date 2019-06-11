import React from 'react'
import ErrorText from './ErrorText'

let ErrorList = ({ Component = ErrorText, children, ...props }) =>
  React.Children.map(children, e =>
    e ? (
      <Component key={e} {...props}>
        {e}
      </Component>
    ) : null
  )
export default ErrorList
