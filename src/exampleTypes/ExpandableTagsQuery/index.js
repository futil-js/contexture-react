import React from 'react'
import _ from 'lodash/fp'
import { withContentRect } from 'react-measure'
import { contexturify } from '../../utils/hoc'
import TagsQuery, { innerHeight } from '../TagsQuery'
import ExpandArrow from './ExpandArrow'

let collapsedStyle = {
  maxHeight: innerHeight,
  overflowY: 'auto',
}

let ExpandableTagsQuery = ({ measureRef, contentRect, isOpen, ...props }) => (
  <>
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
  </>
)

export default _.flow(contexturify, withContentRect())(ExpandableTagsQuery)
