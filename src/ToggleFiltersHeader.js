import React from 'react'
import ToggleFiltersButton from './purgatory/ToggleFiltersButton'
import { Flex } from 'grey-vest'
import { withTheme } from './utils/theme'

let ToggleFiltersHeader = ({ mode, setMode, children }) => (
  <Flex alignItems="center" gap="xs">
    {mode === 'resultsOnly' && (
      <ToggleFiltersButton onClick={() => setMode('basic')} />
    )}
    <>{children}</>
  </Flex>
)

export default withTheme(ToggleFiltersHeader)
