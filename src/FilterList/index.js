import React from 'react'
import _ from 'lodash/fp'
import { setDisplayName } from 'recompose'
import { contexturifyWithoutLoader } from '../utils/hoc'
import { bdJoin } from '../styles/generic'
import FilterLeaf from './FilterLeaf'

// we can't do this on export because FilterList is used internally
let FilterList = _.flow(
  setDisplayName('FilterList'),
  contexturifyWithoutLoader
)(
  ({
    tree,
    node,
    parent,
    fields,
    mapNodeToProps = _.noop,
    mapNodeToLabel = _.noop,
    padding = 8,
    ...props
  }) => (
    <div {...props}>
      {_.map(
        child =>
          child.children ? (
            <FilterList
              key={child.path}
              node={child}
              parent={node}
              {...{ tree, fields, mapNodeToLabel, mapNodeToProps, padding }}
              style={{
                borderLeft: '2px solid',
                marginLeft: parent && 2,
                ...bdJoin(child),
              }}
            />
          ) : (
            <FilterLeaf
              key={child.path}
              node={child}
              parent={node}
              {...{ tree, fields, mapNodeToLabel, mapNodeToProps, padding }}
            />
          ),
        _.get('children', node)
      )}
    </div>
  )
)

export default FilterList
