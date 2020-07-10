import React from 'react'
import F from 'futil'
import _ from 'lodash/fp'
import { Flex } from '../greyVest'

let ErrorText = props => <div className="gv-text-error" {...props} />

let ErrorBlock = ({ children, ...props }) => (
  <Flex className="gv-block-error" alignItems="center" {...props}>
    <i className="material-icons" style={{ marginRight: 8 }}>
      warning
    </i>
    <div>
      <ErrorList>{children}</ErrorList>
    </div>
  </Flex>
)

let ErrorList = ({ block = false, children, ...props }) =>
  F.mapIndexed(
    (e, i) =>
      block ? (
        <ErrorBlock key={i} {...props}>
          {e}
        </ErrorBlock>
      ) : (
        <ErrorText key={i} {...props}>
          {e}
        </ErrorText>
      ),
    _.compact(_.castArray(children))
  )

export default ErrorList
