import React from 'react'
import Flex from './Flex.js'
import { useTheme } from '../utils/hooks.js'

export default function Expandable({
  isOpen,
  className,
  style,
  Label,
  children,
  onClick,
  theme,
}) {
  theme = useTheme(theme)
  return (
    <div
      className={`gv-expandable ${isOpen ? 'expanded' : ''} ${className}`}
      style={style}
    >
      <Flex
        className="gv-expandable-header"
        alignItems="center"
        onClick={onClick}
      >
        <div style={{ flexGrow: 1 }}>{Label}</div>
        <div className={`gv-expandable-icon ${isOpen ? 'expanded' : ''}`}>
          <theme.Icon icon="FilterListExpand" />
        </div>
      </Flex>
      <div className={`gv-expandable-body ${isOpen ? 'expanded' : ''}`}>
        {children}
      </div>
    </div>
  )
}
