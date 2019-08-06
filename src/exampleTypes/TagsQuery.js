import React from 'react'
import _ from 'lodash/fp'
import F from 'futil-js'
import { observer } from 'mobx-react'
import { contexturify, defaultTheme } from '../utils/hoc'
import { bgJoin } from '../styles/generic'
import Checkbox from '../layout/Checkbox'
import { TagsInput } from '../layout/TagsInput'
import RadioList from '../layout/RadioList'
import TagsJoinPicker, { tagToGroupJoin } from './TagsJoinPicker'

let tagValueField = 'word'
let TagsQuery = _.flow(
  contexturify,
  defaultTheme({
    TagsInput,
    Checkbox,
    RadioList,
    Button: 'button',
  }),
)(({ tree, node, theme, placeholder, ...props }) => {
  let getTag = tag => _.find({ [tagValueField]: tag }, node.tags)
  let TagQueryPopover = observer(({ tag }) => {
    let tagInstance = getTag(tag)
    return (
      <div className="tags-input-popover">
        <div>
          <div className="popover-item">
            Keyword: <span className="filter-field-label">{tag}</span>
          </div>
          {_.includes(' ', tag) && (
            <React.Fragment>
              <div className="popover-item">
                <theme.RadioList
                  options={F.autoLabelOptions(['fuzzy', 'exact'])}
                  value={tagInstance.distance ? 'fuzzy' : 'exact'}
                  onChange={value => {
                    tagInstance.distance = value === 'fuzzy' ? 3 : 0
                    tree.mutate(node.path, { tags: [...node.tags] })
                  }}
                />
              </div>
              <div className="popover-item">
                <theme.Button
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
                </theme.Button>
              </div>
            </React.Fragment>
          )}
          <label className="popover-item labeled-checkbox">
            <theme.Checkbox
              checked={tagInstance.onlyShowTheseResults}
              onChange={e => {
                tagInstance.onlyShowTheseResults = e.target.checked
                tree.mutate(node.path, { tags: [...node.tags] })
              }}
            />
            <span>Only view this keyword</span>
          </label>
        </div>
        <div>
          <div style={{ paddingBottom: '15px' }}>
            <small>
              <b>Applies to all keywords:</b>
            </small>
          </div>
          <label className="popover-item labeled-checkbox">
            <theme.Checkbox
              checked={!node.exact}
              onChange={e =>
                tree.mutate(node.path, { exact: !e.target.checked })
              }
            />
            <span>Enable stemming</span>
          </label>
          <div className="popover-item">
            <TagsJoinPicker {...{ node, tree, theme }} />
          </div>
        </div>
      </div>
    )
  })
  let tagStyle = tag => {
    let tagInstance = getTag(tag)
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
  return (
    <theme.TagsInput
      splitCommas
      tags={_.map(tagValueField, node.tags)}
      addTag={tag => {
        tree.mutate(node.path, {
          tags: [...node.tags, { [tagValueField]: tag, distance: 3 }],
        })
      }}
      removeTag={tag => {
        tree.mutate(node.path, {
          tags: _.reject({ [tagValueField]: tag }, node.tags),
        })
      }}
      tagStyle={tagStyle}
      submit={tree.triggerUpdate}
      placeholder={placeholder}
      theme={{ ...theme, PopoverContents: TagQueryPopover }}
      {...props}
    />
  )
})
TagsQuery.displayName = 'TagsQuery'

export default TagsQuery
