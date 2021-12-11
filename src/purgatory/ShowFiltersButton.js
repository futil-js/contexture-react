import React from 'react'
import { withTheme } from '../utils/theme'

let ShowFiltersButton = ({ onClick, theme: { AlternateButton, Icon } }) => (
  <AlternateButton
    data-testid="button-show-filters"
    title="Show Filters"
    onClick={onClick}
  >
    <Icon icon="FilterExpand" />
  </AlternateButton>
)
export default withTheme(ShowFiltersButton)
