import React, { useRef, useEffect, useState } from 'react'
import _ from 'lodash/fp'
import { observer } from 'mobx-react'
import { withNode } from '../utils/hoc'
import { Box, ButtonGroup, Button } from '../greyVest'
import ExpandableTagsInput from '../greyVest/ExpandableTagsInput'
import ExpandableTagsQuery from './ExpandableTagsQuery'

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
    className={`${disabled ? 'disabled' : 'animated pulse infinite'} ${
      className || ''
    }`}
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

let SearchButton = observer(({ tree, resultsPath, searchButtonProps }) => (
  <AnimatedButton
    disabled={!tree.getNode(resultsPath).markedForUpdate}
    onClick={tree.triggerUpdate}
    style={buttonStyle}
    {...searchButtonProps}
  >
    Search
  </AnimatedButton>
))

let SearchBar = ({
  tree,
  node,
  resultsPath,
  actionWrapper,
  searchButtonProps,
  tagsQueryProps,
}) => {
  let ref = useRef(null)
  let [isOpen, setIsOpen] = useState(false)

  let handleOutsideClick = e => {
    if (!ref.current.contains(e.target)) {
      setTimeout(() => setIsOpen(false), 0)
    }
  }

  useEffect(() => {
    document.addEventListener('mouseup', handleOutsideClick)

    return () => {
      document.removeEventListener('mouseup', handleOutsideClick)
    }
  }, [])

  return (
    <ButtonGroup style={searchBarStyle}>
      <Box style={searchBarBoxStyle}>
        <div onClick={() => setIsOpen(true)} ref={ref}>
          <ExpandableTagsQuery
            {...{ tree, node, actionWrapper, isOpen }}
            Loader={({ children }) => <div>{children}</div>}
            style={inputStyle}
            theme={{ TagsInput: ExpandableTagsInput }}
            onAddTag={() => setIsOpen(true)}
            autoFocus
            {...tagsQueryProps}
          />
        </div>
      </Box>
      {tree.disableAutoUpdate && (
        <SearchButton
          tree={tree}
          resultsPath={resultsPath}
          searchButtonProps={searchButtonProps}
        />
      )}
    </ButtonGroup>
  )
}

export default _.flow(observer, withNode)(SearchBar)
