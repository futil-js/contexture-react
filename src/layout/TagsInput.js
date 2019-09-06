import React from 'react'
import _ from 'lodash/fp'
import F from 'futil-js'
import { withState, defaultProps } from 'recompose'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import { Flex } from './Flex'
import Popover from './Popover'
import OutsideClickHandler from 'react-outside-click-handler'

let isValidInput = (tag, tags) => !_.isEmpty(tag) && !_.includes(tag, tags)

let Tag = observer(({ value, removeTag, tagStyle, RemoveIcon, onClick }) => (
  <span
    className="tags-input-tag"
    style={{
      display: 'inline-block',
      cursor: 'pointer',
      margin: 3,
      borderRadius: '3px',
      ...F.callOrReturn(tagStyle, value),
    }}
    onClick={onClick}
  >
    <Flex style={{ alignItems: 'center' }}>
      <span
        style={{
          paddingLeft: '0.45em',
          paddingBottom: '0.15em',
          // Prefer padding on the remove icon so it has more area to receive
          // clicks
          paddingRight: RemoveIcon ? '0em' : '0.45em',
        }}
      >
        {value}
      </span>
      {RemoveIcon && (
        <RemoveIcon
          onClick={e => {
            e.stopPropagation()
            removeTag(value)
          }}
        />
      )}
    </Flex>
  </span>
))
Tag.displayName = 'Tag'

let DefaultTagComponent = defaultProps({
  RemoveIcon: props => (
    <span className="tags-input-tag-remove" {...props}>
      x
    </span>
  ),
})(Tag)

// We're only using withState to preserve the state between renders, since
// inject doesn't do that for us.
let TagsInput = withState('state', 'setState', () =>
  observable({
    currentInput: '',
    selectedTag: null,
    popoverOpen: false,
    itemPopoverOpen: false,
    isOneLine: false,
    isInputVisible: true,
  })
)(
  observer(
    ({
      tags,
      state,
      addTag,
      removeTag,
      submit = _.noop,
      tagStyle,
      TagComponent = DefaultTagComponent,
      placeholder = 'Search...',
      splitCommas,
      PopoverContents,
      ItemPopoverContents,
      style,
      ...props
    }) => {
      const LINE_HEIGHT = 72
      let containerRef
      let inputRef
      let isOpen = F.lensProp('popoverOpen', state)
      addTag = splitCommas
        ? _.flow(
            _.split(','),
            _.invokeMap('trim'),
            _.compact,
            _.uniq,
            _.difference(_, tags),
            _.map(addTag)
          )
        : _.flow(
            _.trim,
            addTag
          )
      return (
        <OutsideClickHandler
          onOutsideClick={() => {
            if (!state.isOneLine) {
              state.isOneLine = containerRef.clientHeight > LINE_HEIGHT
            }
            state.isInputVisible = false
            containerRef.scrollTop = 0
          }}
        >
          <div
            className={`tags-input ${
              state.isOneLine ? 'tags-input-one-line' : ''
            }`}
            ref={e => {
              if (e) {
                containerRef = e
              }
            }}
            style={{ ...style }}
          >
            <span
              className="tags-input-container"
              onClick={() => {
                state.isInputVisible = true
                state.isOneLine = false
                inputRef && inputRef.focus()
              }}
            >
              {(state.isInputVisible || !tags.length) && (
                <input
                  ref={e => (inputRef = e)}
                  onChange={e => {
                    state.currentInput = e.target.value
                  }}
                  onBlur={() => {
                    if (isValidInput(state.currentInput, tags)) {
                      addTag(state.currentInput)
                      state.currentInput = ''
                    }
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !state.currentInput) submit()
                    if (
                      (_.includes(e.key, ['Enter', 'Tab']) ||
                        (splitCommas && e.key === ',')) &&
                      isValidInput(state.currentInput, tags)
                    ) {
                      addTag(state.currentInput)
                      state.currentInput = ''
                      state.isInputVisible = true
                      e.preventDefault()
                    }
                    if (
                      e.key === 'Backspace' &&
                      !state.currentInput &&
                      tags.length
                    ) {
                      let last = _.last(tags)
                      removeTag(last)
                      state.currentInput = last
                      e.preventDefault()
                    }
                  }}
                  value={state.currentInput}
                  placeholder={placeholder}
                  {...props}
                />
              )}
              {_.map(
                t => (
                  <TagComponent
                    key={t}
                    value={t}
                    {...{ removeTag, tagStyle }}
                    onClick={() => {
                      state.itemPopoverOpen = true
                      state.selectedTag = t
                    }}
                  />
                ),
                tags
              )}
            </span>
            {PopoverContents && (
              <span
                className="popover-actions"
                onClick={() => {
                  state.popoverOpen = true
                }}
              >
                <i className="material-icons">more_vert</i>
              </span>
            )}
            {ItemPopoverContents && (
              <Popover isOpen={F.lensProp('itemPopoverOpen', state)}>
                <ItemPopoverContents tag={state.selectedTag} />
              </Popover>
            )}
          </div>
          {!!(state.isOneLine && tags.length) && (
            <div
              className="down-arrow-shape-container"
              onClick={() => {
                if (state.isOneLine) {
                  state.isOneLine = false
                  state.isInputVisible = true
                }
              }}
            >
              <div
                className="down-arrow-shape"
                title="Expand to see all keywords"
              >
                <i
                  className="material-icons"
                  style={{ zIndex: 10, position: 'relative' }}
                >
                  keyboard_arrow_down
                </i>
              </div>
            </div>
          )}
          {PopoverContents && (
            <Popover isOpen={isOpen}>
              <PopoverContents
                isOpen={isOpen}
                isOneLine={F.lensProp('isOneLine', state)}
              />
            </Popover>
          )}
        </OutsideClickHandler>
      )
    }
  )
)
TagsInput.displayName = 'TagsInput'

// Just uses an internal observable array
let MockTagsInput = inject(() => {
  let tags = observable([])
  return {
    tags,
    addTag(tag) {
      tags.push(tag)
    },
    removeTag(tag) {
      tags = _.without(tag, tags)
    },
  }
})(TagsInput)
MockTagsInput.displayName = 'MockTagsInput'

export { Tag, TagsInput, MockTagsInput }
