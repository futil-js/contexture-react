import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { Grid } from 'grey-vest'

let SearchLayout = ({ mode, gap = 24, className, ...props }) => (
  <Grid
    gap={gap}
    columns={mode === 'basic' ? '320px minmax(0, 1fr)' : 'minmax(0, 1fr)'}
    className={`search-layout search-layout-${mode} ${className}`}
    {...props}
  />
)

SearchLayout.propTypes = {
  mode: PropTypes.oneOf(['basic', 'builder', 'resultsOnly']),
}

export default observer(SearchLayout)
