import React, { useState } from 'react'
import _ from 'lodash/fp.js'
import F from 'futil'
import { toNumber } from '../utils/format.js'
import { observer } from 'mobx-react'
import { Flex } from '../greyVest/index.js'
import { useTheme, useNode } from '../utils/hooks.js'

let commonStyle = {
  justifyContent: 'space-between',
  alignItems: 'center',
  display: 'flex',
  cursor: 'pointer',
}

export let displayFn = (name, label) => (_.isString(label) ? label : name)
export let displayBlankFn = () => <i>Not Specified</i>

export let Cardinality = observer(function Cardinality({ node, tree }) {
  let size = node.size || 10
  let count = _.get('context.cardinality', node)
  if (count) {
    return (
      <Flex
        className="contexture-facet-cardinality"
        justifyContent="space-between"
      >
        <div>
          Showing {toNumber(_.min([size, _.size(node.context.options)]))} of{' '}
          {toNumber(count)}
        </div>
        {count > size && (
          <div>
            <a
              onClick={() => tree.mutate(node.path, { size: size + 10 })}
              style={{ cursor: 'pointer' }}
            >
              View More
            </a>
          </div>
        )}
      </Flex>
    )
  }
  return null
})

export let SelectAll = observer(function SelectAll({
  node,
  tree,
  theme,
  maxChecked = 500,
}) {
  let { Checkbox } = useTheme(theme)
  let notChecked = _.difference(
    _.map('name', _.get('context.options', node)),
    node.values
  )
  let isAllChecked = _.isEmpty(notChecked)
  let allChecked = [...node.values, ...notChecked]
  let isOverTheLimit = _.size(allChecked) > maxChecked

  // If the items are all already selected and we are not going to be over the max if we select all
  // then show the "Select All". This way we still allow the user to be able to "Unselect all"
  return !isOverTheLimit || isAllChecked ? (
    <label style={commonStyle}>
      <Checkbox
        checked={isAllChecked}
        onChange={() => {
          if (isAllChecked)
            tree.mutate(node.path, {
              values: [],
            })
          else {
            tree.mutate(node.path, { values: allChecked })
          }
        }}
      />
      <div style={{ flex: 2, padding: '0 5px' }}>Select All Visible</div>
    </label>
  ) : null
})

export let FacetOptionsFilter = observer(function FacetOptionsFilter({
  tree,
  node,
  theme,
}) {
  let { TextInput, Button, ButtonGroup } = useTheme(theme)
  let [val, setVal] = useState(node.optionsFilter)
  let buttonEnabled = val !== node.optionsFilter
  let submit = () =>
    buttonEnabled && tree.mutate(node.path, { optionsFilter: val })
  return (
    <ButtonGroup>
      <TextInput
        value={val}
        onChange={(e) => {
          setVal(e.target.value)
        }}
        onKeyPress={(e) => e.key === 'Enter' && submit()}
        onBlur={submit}
        placeholder="Search..."
      />
      <Button primary={node.optionsFilter !== val} onClick={submit}>
        Find
      </Button>
    </ButtonGroup>
  )
})

export let FacetCheckboxList = observer(function FacetCheckboxList({
  tree,
  node,
  hide,
  display = displayFn,
  displayBlank = displayBlankFn,
  formatCount,
  path,
  theme,
}) {
  node = useNode(node, path, tree)
  let { Checkbox } = useTheme(theme)
  return _.flow(
    _.partition((x) => _.includes(x.name, node.values)),
    _.flatten,
    F.mapIndexed(({ name, label, count }, i) => {
      let lens = tree.lens(node.path, 'values')
      return (
        <label
          // not using unique keys for smart DOM reordering
          // this causes the whole filter section to scroll up
          // when clicking something at the bottom of a long list
          key={i}
          style={commonStyle}
          title={`${display(name, label)} : ${formatCount(count)}`}
        >
          <Checkbox {...F.domLens.checkboxValues(name, lens)} />
          <div style={{ flex: 2, padding: '0 5px' }}>
            {display(name, label) || displayBlank()}
          </div>
          {!hide.counts && <div>{formatCount(count)}</div>}
        </label>
      )
    })
  )(_.get('context.options', node))
})
