import React from 'react'
import ErrorBlock from './ErrorBlock'
import ErrorText from './ErrorText'

let ErrorList = ({ block = false, children, ...props }) =>
  React.Children.map(children,
    e =>
      block ? (
        <ErrorBlock key={e} {...props}>{e}</ErrorBlock>
      ) : (
        <ErrorText key={e} {...props}>{e}</ErrorText>
      ),
  ) || null
export default ErrorList
