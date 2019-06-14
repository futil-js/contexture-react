import React from 'react'

let Button = ({
  isActive,
  primary,
  as: As = 'button',
  className,
  disabled,
  onClick,
  ...x
}) => (
  <As
    className={`gv-button ${isActive ? 'active' : ''} ${
      primary ? 'primary' : ''
    } ${className || ''}`}
    disabled={disabled}
    onClick={disabled ? () => {} : onClick}
    {...x}
  />
)
export default Button
