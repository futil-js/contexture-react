import React from 'react'
import F from 'futil'
import _ from 'lodash/fp'
import { Flex } from '../greyVest'
import Icon from './Icon'

let ErrorText = ({ children }) => (
  <div className="gv-text-error">{children}</div>
)

let ErrorBlock = ({ children, ...props }) => (
  <Flex className="gv-block-error" alignItems="center" {...props}>
    <Icon icon="Warning" style={{ marginRight: 8 }} />
    <div>
      <ErrorList>{children}</ErrorList>
    </div>
  </Flex>
)

let ErrorList = ({ block = false, children }) =>
  F.mapIndexed(
    (e, i) =>
      block ? (
        <ErrorBlock key={i}>{e}</ErrorBlock>
      ) : (
        <ErrorText key={i}>{e}</ErrorText>
      ),
    _.castArray(children)
  )

export default ErrorList
