import React from 'react'
import { useTheme } from '../utils/hooks.js'

let ShowFiltersButton = ({ onClick, theme }) => {
  let { AlternateButton, Icon } = useTheme(theme)
  return (
    <AlternateButton title="Show Filters" onClick={onClick}>
      <Icon icon="FilterExpand" />
    </AlternateButton>
  )
}
export default ShowFiltersButton
