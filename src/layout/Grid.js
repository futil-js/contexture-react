import React from 'react'

export let Grid = ({ style, columns, rows, gap, ...x }) => (
  <div
    style={{
      display: 'grid',
      ...(columns && {
        gridTemplateColumns: columns,
        msGridTemplateColumns: columns,
      }),
      ...(rows && {
        gridTemplateRows: rows,
        msGridTemplateRows: rows,
      }),
      ...(gap && { gridGap: gap }),
      ...style,
    }}
    {...x}
  />
)
