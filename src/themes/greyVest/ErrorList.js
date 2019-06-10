import React from 'react'
import _ from 'lodash/fp'
import ErrorBlock from './ErrorBlock'
import ErrorText from './ErrorText'

let ErrorList = ({ ErrorComponent, block = false, children, ...props }) => {
  if (!ErrorComponent) {
    ErrorComponent = block ? ErrorBlock : ErrorText
  }
  return _.map(
    e =>
      e ? (
        <ErrorComponent key={e} {...props}>
          {e}
        </ErrorComponent>
      ) : null,
    _.castArray(children)
  )
}
export default ErrorList
