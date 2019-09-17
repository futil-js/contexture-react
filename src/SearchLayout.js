import React from 'react'
import F from 'futil-js'
import { observable } from 'mobx'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'

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
  let [stateLayout] = React.useState(observable.box('basic'))
  let layout = mode ? F.stateLens([mode, setMode]) : stateLayout
  return (
    <Context.Provider value={layout}>
      <div style={{ ...styles(F.view(layout)), ...style }} {...props} />
    </Context.Provider>
  )
}

SearchLayout.propTypes = {
  mode: PropTypes.oneOf(['basic', 'builder', 'resultsOnly']),
}

export default observer(SearchLayout)
