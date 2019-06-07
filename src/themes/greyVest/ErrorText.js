import React from 'react'

// Error Text / List General Components
let ErrorText = ({ children, ...props }) => (
  <div className="gv-text-error" {...props}>
    {children}
  </div>
)

export default ErrorText
