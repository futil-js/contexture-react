import React from 'react'
import F from 'futil-js'
import PropTypes from 'prop-types'

let Context = React.createContext()

export let useSearchLayout = () => React.useContext(Context)

let margin = 24

let styles = mode => ({
  display: 'grid',
  gridGap: margin,
  margin: `0 ${margin}px`,
  marginBottom: margin,
  gridTemplateColumns:
    mode === 'basic' ? 'minmax(250px, 400px) minmax(0, 1fr)' : 'minmax(0, 1fr)',
})

let SearchLayout = ({ mode, setMode, style, className, ...props }) => {
  let stateLayout = React.useState('basic')
  let layout = F.stateLens(mode ? [mode, setMode] : stateLayout)
  return (
    <Context.Provider value={layout}>
      <div
        className={`search-layout search-layout-${F.view(layout)} ${className}`}
        style={{ ...styles(F.view(layout)), ...style }}
        {...props}
      />
    </Context.Provider>
  )
}

SearchLayout.propTypes = {
  mode: PropTypes.oneOf(['basic', 'builder', 'resultsOnly']),
}

export default SearchLayout
