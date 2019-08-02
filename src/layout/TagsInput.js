import React from 'react'
import _ from 'lodash/fp'
import F from 'futil-js'
import { withState } from 'recompose'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import { Flex } from './Flex'
import DefaultPopover from './Popover'
import { defaultTheme } from '../utils/hoc'
import OutsideClickHandler from 'react-outside-click-handler'

let isValidTag = (tag, tags) => {
  let cleanTag = _.trim(tag)
  return !_.isEmpty(cleanTag) && !_.includes(cleanTag, tags)
}

let Tag = observer(({ value, removeTag, theme, tagStyle, onClick }) => (
  <span
    className="tags-input-tag"
    style={{
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
          paddingRight: theme.RemoveIcon ? '0em' : '0.45em',
        }}
      >
        {value}
      </span>
      {theme.RemoveIcon && (
        <theme.RemoveIcon
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

let DefaultTagComponent = defaultTheme({
  RemoveIcon: props => (
    <span className="tags-input-tag-remove" {...props}>
      x
    </span>
  )
})(Tag)

// We're only using withState to preserve the state between renders, since
// inject doesn't do that for us.
let TagsInput = _.flow(
  observer,
  defaultTheme({
    TagComponent: DefaultTagComponent,
    Popover: DefaultPopover
  }),
  withState('state', 'setState', () =>
    observable({
      currentInput: '',
      selectedTag: null,
      popoverOpen: false,
      isOneLine: true,
    })
  )
)(
  ({
    tags,
    state,
    addTag,
    removeTag,
    submit = _.noop,
    tagStyle,
    theme,
    placeholder = 'Search...',
    splitCommas,
    style,
    ...props
  }) => {
    let containerRef
    let inputRef
    if (splitCommas)
      addTag = _.flow(
        _.split(','),
        _.map(addTag)
      )
    return (
      <OutsideClickHandler
        onOutsideClick={() => {
          state.isOneLine = true
          containerRef.scrollTop = 0
        }}
      >
        <div
          className={`tags-input ${
            state.isOneLine ? 'tags-input-one-line' : ''
          }`}
          ref={e => (containerRef = e ? e : containerRef)}
          style={{ ...style }}
          onClick={() => {
            if (state.isOneLine) {
              state.isOneLine = false
              inputRef.focus()
            }
          }}
        >
          <Flex
            wrap
            alignItems="center"
            style={{
              cursor: 'text',
              height: '100%',
              padding: 2,
            }}
          >
            {_.map(
              t => (
                <theme.TagComponent
                  key={t}
                  value={t}
                  {...{ removeTag, tagStyle }}
                  onClick={() => {
                    state.popoverOpen = true
                    state.selectedTag = t
                  }}
                />
              ),
              tags
            )}
            <input
              style={{
                border: 'none',
                outline: 'none',
                flex: 1,
                margin: 3,
                minWidth: 120,
              }}
              ref={e => (inputRef = e)}
              onChange={e => {
                state.currentInput = e.target.value
              }}
              onBlur={() => {
                if (isValidTag(state.currentInput, tags)) {
                  addTag(state.currentInput)
                  state.currentInput = ''
                }
              }}
              onKeyDown={e => {
                let currentInput = _.trim(state.currentInput)
                if (e.key === 'Enter' && !currentInput) submit()
                if (
                  (e.key === 'Enter' ||
                    e.key === 'Tab' ||
                    (splitCommas && e.key === ',')) &&
                  isValidTag(currentInput, tags)
                ) {
                  addTag(currentInput)
                  state.currentInput = ''
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
          </Flex>
          {theme.PopoverContents && (
            <theme.Popover isOpen={F.lensProp('popoverOpen', state)}>
              <theme.PopoverContents tag={state.selectedTag} />
            </theme.Popover>
          )}
        </div>
      </OutsideClickHandler>
    )
  }
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
