import React from 'react'
import F from 'futil'
import _ from 'lodash/fp'
import { observer } from 'mobx-react'
import OutsideClickHandler from 'react-outside-click-handler'
import { useLensObject } from '../utils/react'
import { withNode } from '../utils/hoc'
import { Box, ButtonGroup, Button, theme } from 'grey-vest'
import ExpandableTagsQuery from './ExpandableTagsQuery'

let searchBarBoxStyle = {
  padding: '8px 10px',
  flex: 1,
}

let buttonStyle = {
  boxShadow: theme.boxShadows.normal,
  fontSize: 18,
  maxHeight: 56,
}

let AnimatedButton = ({ disabled, style, className, ...props }) => (
  <Button
    large
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
}) => {
  let collapse = React.useState(true)
  let popoverState = useLensObject({ open: false, tagOpen: '' })
  return (
    <OutsideClickHandler
      display="contents"
      onOutsideClick={() => {
        F.on(collapse)()
        F.off(popoverState.open)()
        F.set('', popoverState.tagOpen)
      }}
    >
      <ButtonGroup inline={false} style={{ overflow: 'visible' }}>
        <Box style={searchBarBoxStyle} onClick={F.off(collapse)}>
          <ExpandableTagsQuery
            {...{ tree, node, collapse, popoverState, actionWrapper }}
            onAddTag={F.off(collapse)}
            Loader={({ children }) => <div>{children}</div>}
            style={{ border: 0 }}
            autoFocus
          />
        </Box>
        {tree.disableAutoUpdate && (
          <SearchButton
            tree={tree}
            resultsPath={resultsPath}
            searchButtonProps={searchButtonProps}
          />
        )}
      </ButtonGroup>
    </OutsideClickHandler>
  )
}

export default _.flow(
  observer,
  withNode
)(SearchBar)
