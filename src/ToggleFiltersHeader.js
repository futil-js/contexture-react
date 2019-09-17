import React from 'react'
import F from 'futil-js'
import { observer } from 'mobx-react'
import ToggleFiltersButton from './purgatory/ToggleFiltersButton'
import { Flex } from './greyVest'
import { useSearchLayout } from './SearchLayout'

let ToggleFiltersHeader = ({ children }) => {
  let layout = useSearchLayout()
  return (
    <Flex style={{ alignItems: 'center' }}>
      {F.view(layout) === 'resultsOnly' && (
        <span style={{ marginRight: 5 }}>
          <ToggleFiltersButton onClick={F.sets('basic', layout)} />
        </span>
      )}
      <h1>{children}</h1>
    </Flex>
  )
}

export default observer(ToggleFiltersHeader)
