import React from 'react'
import { withTheme } from '../utils/theme'

let ToggleFiltersButton = ({ onClick, theme: { AlternateButton } }) => (
  <AlternateButton title="Toggle Filters" onClick={onClick} icon="FilterAdd" />
)
export default withTheme(ToggleFiltersButton)
