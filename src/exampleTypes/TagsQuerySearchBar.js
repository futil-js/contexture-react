import React from 'react'
import F from 'futil-js'
import { observer } from 'mobx-react'
import OutsideClickHandler from 'react-outside-click-handler'
import { useLens } from '../utils/react'
import { Box, ButtonGroup, Button } from '../greyVest'
import ExpandableTagsInput from '../greyVest/ExpandableTagsInput'
import ExpandableTagsQuery from './TagsQuery/ExpandableTagsQuery'

let searchBarStyle = {
  overflow: 'visible', // for the search button animation
}

let searchBarBoxStyle = {
  padding: '8px 10px',
  flex: 1,
}

let inputStyle = {
  border: 'none',
}

let buttonStyle = {
  boxShadow: '0 2px 10px 0 rgba(39, 44, 65, 0.1)',
  fontSize: 18,
  maxHeight: 56,
}

let AnimatedButton = ({ disabled, style, className, ...props }) => (
  <Button
    className={`${
      disabled ? 'disabled' : 'animated pulse infinite'
    } ${className || ''}`}
    // BG Color is 50% white + primary button background, replacing 50% opacity
    style={{
      ...style,
      ...(disabled ? { backgroundColor: '#80BBEF' } : {}),
      animationDuration: '500ms',
    }}
    primary
    {...props}
  />
)

let SearchButton = observer(({ tree, resultsPath }) => (
  <AnimatedButton
    disabled={!tree.getNode(resultsPath).markedForUpdate}
    onClick={tree.triggerUpdate}
    style={buttonStyle}
  >
    Search
  </AnimatedButton>
))

let SearchBar = ({ tree, path, resultsPath }) => {
  let collapse = useLens(false)
  return (
    <OutsideClickHandler onOutsideClick={F.on(collapse)}>
      <ButtonGroup style={searchBarStyle}>
        <Box style={searchBarBoxStyle} onClick={F.off(collapse)}>
          <ExpandableTagsQuery
            {...{ tree, path, collapse }}
            Loader={({ children }) => <div>{children}</div>}
            style={inputStyle}
            theme={{ TagsInput: ExpandableTagsInput }}
            autoFocus
          />
        </Box>
        <SearchButton tree={tree} resultsPath={resultsPath} />
      </ButtonGroup>
    </OutsideClickHandler>
  )
}

export default SearchBar