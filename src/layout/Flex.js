import React from 'react'
import F from 'futil-js'
import _ from 'lodash/fp'

let defaultPx = prop => (_.isNumber(prop) ? `${prop}px` : prop)

export let Flex = ({
  as: Component = 'div',
  style,
  alignItems,
  alignContent,
  justifyContent,
  childSpacing,
  wrap = false,
  column = false,
  children,
  ...props
}) => (
  <Component
    style={{
      display: 'flex',
      flexWrap: wrap && 'wrap',
      flexDirection: column && 'column',
      alignItems,
      justifyContent,
      alignContent,
      ...style,
    }}
    {...props}
  >
    {childSpacing
      ? F.intersperse(
          () => <div style={{ flex: `0 1 ${defaultPx(childSpacing)}` }} />,
          children
        )
      : children}
  </Component>
)
