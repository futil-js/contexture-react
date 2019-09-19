import React from 'react'
import F from 'futil-js'
import PropTypes from 'prop-types'

let Context = React.createContext()

export let useSearchLayout = () => React.useContext(Context)

let styles = mode => ({
  display: 'grid',
  gridGap: 40,
  margin: '0 40px',
  marginBottom: 50,
  gridTemplateColumns:
    mode === 'basic' ? 'minmax(250px, 400px) minmax(0, 1fr)' : 'minmax(0, 1fr)',
})

let SearchLayout = ({ style, mode, setMode, ...props }) => {
  let stateLayout = React.useState('basic')
  let layout = F.stateLens(mode ? [mode, setMode] : stateLayout)
  return (
    <Context.Provider value={layout}>
      <div style={{ ...styles(F.view(layout)), ...style }} {...props} />
    </Context.Provider>
  )
}

SearchLayout.propTypes = {
  mode: PropTypes.oneOf(['basic', 'builder', 'resultsOnly']),
}

export default SearchLayout
