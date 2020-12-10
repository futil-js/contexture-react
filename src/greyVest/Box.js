import React from 'react'
import F from 'futil'

let Box = React.forwardRef(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={F.compactJoin(' ', ['gv-box', className])}
    {...props}
  />
))

export default Box
