import React from 'react'
import { useTheme } from '../utils/hooks.js'

export default function ShowFiltersButton({ onClick, theme }) {
  theme = useTheme(theme)
  return (
    <theme.AlternateButton title="Show Filters" onClick={onClick}>
      <theme.Icon icon="FilterExpand" />
    </theme.AlternateButton>
  )
}
