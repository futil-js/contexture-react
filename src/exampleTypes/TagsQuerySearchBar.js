import React from 'react'
import F from 'futil'
import _ from 'lodash/fp.js'
import { observer } from 'mobx-react'
import OutsideClickHandler from 'react-outside-click-handler'
import { useNode, useTheme } from '../utils/hooks.js'
import ExpandableTagsInput, { Tags } from '../greyVest/ExpandableTagsInput.js'
import ExpandableTagsQuery from './ExpandableTagsQuery/index.js'

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

let AnimatedButton = ({ theme, disabled, style, className, ...props }) => (
  <theme.Button
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

let SearchButton = observer(
  ({ theme, tree, resultsPath, searchButtonProps }) => (
    <AnimatedButton
      theme={theme}
      disabled={!tree.getNode(resultsPath).markedForUpdate}
      onClick={tree.triggerUpdate}
      style={buttonStyle}
      {...searchButtonProps}
    >
      Search
    </AnimatedButton>
  )
)

export default observer(function SearchBar({
  tree,
  node,
  path,
  resultsPath,
  actionWrapper,
  searchButtonProps,
  tagsQueryProps,
  theme,
}) {
  node = useNode(node, path, tree)
  theme = useTheme(theme)
  let collapse = React.useState(true)
  return (
    <OutsideClickHandler.default
      onOutsideClick={() => {
        F.on(collapse)()
      }}
      useCapture={false}
    >
      <theme.ButtonGroup
        data-path={node.path}
        style={searchBarStyle}
        // The outside click handler listens for the onMouseUp event which takes priority over any onClick handlers in the children
        // So we need to add this handler to ensure that the child events are triggered appropriately
        onMouseUp={(e) => {
          e.stopPropagation()
        }}
      >
        <theme.Box style={searchBarBoxStyle} onClick={F.off(collapse)}>
          <ExpandableTagsQuery
            {...{ tree, node, collapse, actionWrapper }}
            onAddTag={F.off(collapse)}
            style={inputStyle}
            theme={{
              Loader: ({ children }) => <div>{children}</div>,
              TagsInput:
                F.view(collapse) && !_.isEmpty(node.tags)
                  ? Tags
                  : ExpandableTagsInput,
            }}
            autoFocus
            {...tagsQueryProps}
          />
        </theme.Box>
        {tree.disableAutoUpdate && (
          <SearchButton
            theme={theme}
            tree={tree}
            resultsPath={resultsPath}
            searchButtonProps={searchButtonProps}
          />
        )}
      </theme.ButtonGroup>
    </OutsideClickHandler.default>
  )
})
