import React, { useRef, useEffect, useState } from 'react'
import _ from 'lodash/fp'
import F from 'futil'
import { withContentRect } from 'react-measure'
import { contexturify } from '../../utils/hoc'
import TagsQuery, { innerHeight } from '../TagsQuery'
import ExpandArrow from './ExpandArrow'

let collapsedStyle = {
  maxHeight: innerHeight,
  overflowY: 'auto',
}

let ExpandableTagsQuery = ({ measureRef, contentRect, isOpen, ...props }) => (
  // let node = useRef()
  // let [isOpen, setIsOpen] = useState(false)

  // let handleOutsideClick = e => {
  //   if (node.current.contains(e.target)) {
  //     console.log('CLICKED INSIDE')
  //     return
  //   }
  //   console.log('CLICKED OUTSIDE')
  //   setTimeout(() => setIsOpen(false), 0)
  // }

  // useEffect(() => {
  //   document.addEventListener('mousedown', handleOutsideClick)

  //   return () => {
  //     document.removeEventListener('mousedown', handleOutsideClick)
  //   }
  // }, [])

  <div>
    <div style={isOpen ? {} : collapsedStyle}>
      <div ref={measureRef}>
        <TagsQuery
          {...{
            ..._.omit('measure', props),
            isOpen,
          }}
        />
      </div>
    </div>
    {!isOpen && contentRect.entry.height > innerHeight && (
      <ExpandArrow isOpen={isOpen} tagsLength={props.node.tags.length} />
    )}
  </div>
)

export default _.flow(contexturify, withContentRect())(ExpandableTagsQuery)
