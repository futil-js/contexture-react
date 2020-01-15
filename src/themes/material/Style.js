import React from 'react'
import { Style as GVStyle } from 'grey-vest'

export default () => (
  <>
    <style>
      {`
        .material-table th span {
          display: flex;
          flex-wrap: nowrap;
          align-items: center;
          justify-content: center;
        }
      `}
    </style>
    <GVStyle />
  </>
)
