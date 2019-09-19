import React from 'react'
import _ from 'lodash/fp'
import F from 'futil-js'
import { observer } from 'mobx-react'
import { setDisplayName } from 'recompose'
import { contexturify } from '../utils/hoc'
import { bgJoin } from '../styles/generic'
import TagsJoinPicker, { tagToGroupJoin } from './TagsJoinPicker'
import { withTheme } from '../utils/theme'
import { useLens } from '../utils/react'

const tagValueField = 'word'
let getTag = (tag, node = {}) => _.find({ [tagValueField]: tag }, node.tags)

// TagsInput expects a `tagStyle` prop, which is a function of `tag`
let getTagStyle = node => tag => {
  let tagInstance = getTag(tag, node)
  return {
    ...(tagInstance.distance ? {} : { fontWeight: 'bold' }),
    ...bgJoin(tagToGroupJoin(_.get('join', node))),
    opacity:
      tagInstance.onlyShowTheseResults ||
      !_.find('onlyShowTheseResults', node.tags)
        ? 1
        : 0.5,
  }
}

let TagQueryItemPopover = _.flow(
  setDisplayName('TagQueryItemPopover'),
  observer,
  withTheme
)(({ tag, node, tree, theme: { Button, Checkbox, RadioList } }) => {
  let tagInstance = getTag(tag, node)
  return (
    <div className="tags-input-popover">
      <div>
        <div className="popover-item">
          Keyword: <span className="filter-field-label">{tag}</span>
        </div>
        {_.includes(' ', tag) && (
          <React.Fragment>
            <div className="popover-item">
              <RadioList
                options={F.autoLabelOptions(['fuzzy', 'exact'])}
                value={tagInstance.distance ? 'fuzzy' : 'exact'}
                onChange={value => {
                  tagInstance.distance = value === 'fuzzy' ? 3 : 0
                  tree.mutate(node.path, { tags: [...node.tags] })
                }}
              />
            </div>
            <div className="popover-item">
              <Button
                onClick={() => {
                  tree.mutate(node.path, {
                    tags: _.map(tag => {
                      if (_.includes(' ', tag[tagValueField]))
                        tag.distance = tagInstance.distance
                      return tag
                    }, node.tags),
                  })
                }}
              >
                Apply to all keywords
              </Button>
            </div>
          </React.Fragment>
        )}
        <label className="popover-item labeled-checkbox">
          <Checkbox
            checked={tagInstance.onlyShowTheseResults}
            onChange={e => {
              tagInstance.onlyShowTheseResults = e.target.checked
              tree.mutate(node.path, { tags: [...node.tags] })
            }}
          />
          <span>Only view this keyword</span>
        </label>
      </div>
    </div>
  )
})

let TagQueryPopover = _.flow(
  setDisplayName('TagQueryPopover'),
  observer,
  withTheme
)(({ node, tree, open, theme: { Button, Checkbox } }) => (
  <div className="tags-popover">
    {!!_.get('tags.length', node) && (
      <>
        <Button
          className="popover-item"
          onClick={() => {
            copyTags(node)
            F.off(open)()
          }}
        >
          Copy Keywords
        </Button>
        <Button
          className="popover-item"
          style={{ marginTop: 15 }}
          onClick={() => {
            tree.mutate(node.path, {
              tags: [],
            })
            F.off(open)()
          }}
        >
          Clear Keywords
        </Button>
        <div className="line-separator" />
      </>
    )}
    <label className="labeled-checkbox">
      <Checkbox
        checked={!node.exact}
        onChange={e => tree.mutate(node.path, { exact: !e.target.checked })}
      />
      <span>Enable stemming</span>
    </label>
    <div className="popover-item">
      <TagsJoinPicker node={node} tree={tree} />
    </div>
  </div>
))

let copyTags = node => {
  if (node.tags) {
    let words = _.flow(
      _.map('word'),
      _.reverse,
      _.join(',')
    )(node.tags)
    navigator.clipboard.writeText(words)
  }
}

let TagsQuery = ({
  tree,
  node,
  placeholder,
  theme: { Popover, TagsInput },
  ...props
}) => {
  // let getTag = tag => _.find({ [tagValueField]: tag }, node.tags)
  let open = useLens(false)
  let tagOpen = useLens(false)
  let [selectedTag, setSelectedTag] = React.useState(null)
  return (
    <>
      <TagsInput
        splitCommas
        tags={_.map(tagValueField, node.tags)}
        onTagClick={tag => {
          F.on(tagOpen)()
          setSelectedTag(tag)
        }}
        addTag={tag => {
          tree.mutate(node.path, {
            tags: [{ [tagValueField]: tag, distance: 3 }, ...node.tags],
          })
        }}
        removeTag={tag => {
          tree.mutate(node.path, {
            tags: _.reject({ [tagValueField]: tag }, node.tags),
          })
        }}
        tagStyle={getTagStyle(node)}
        submit={tree.triggerUpdate}
        placeholder={placeholder}
        {...props}
      />
      <Popover open={tagOpen}>
        <TagQueryItemPopover tag={selectedTag} node={node} tree={tree} />
      </Popover>
      <span className="popover-actions" onClick={F.on(open)}>
        <i className="material-icons">more_vert</i>
        <Popover open={open}>
          <TagQueryPopover open={open} node={node} tree={tree} />
        </Popover>
      </span>
    </>
  )
}

export default contexturify(TagsQuery)
