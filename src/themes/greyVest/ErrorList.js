import React from 'react'
import _ from 'lodash/fp'
import ErrorText from './ErrorText'

let ErrorList = ({ ErrorComponent = ErrorText, children, ...props }) =>
  _.map(
    e =>
      e ? (
        <ErrorComponent key={e} {...props}>
          {e}
        </ErrorComponent>
      ) : null,
    _.castArray(children)
  )
export default ErrorList
