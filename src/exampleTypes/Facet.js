import React, { useState } from 'react'
import _ from 'lodash/fp'
import F from 'futil-js'
import { observer, Observer } from 'mobx-react'
import { Flex } from '../layout/Flex'
import Checkbox from '../layout/Checkbox'
import { contexturify, defaultTheme } from '../utils/hoc'

let RadioList = ({ value, onChange, options }) => (
  <Flex style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
    {_.map(
      x => (
        <label key={x.value} onClick={() => onChange(x.value)}>
          <input type="radio" checked={x.value === value} onChange={() => {}} />
          {x.label}
        </label>
      ),
      options
    )}
  </Flex>
)

let SelectAll = _.flow(
  observer,
  defaultTheme({ Checkbox })
)(({ node, tree, theme }) => {
  let missingOptions = _.difference(
    _.map('name', _.get('context.options', node)),
    node.values
  )
  let allSelected = _.isEmpty(missingOptions)
  return (
    <label
      style={{
        justifyContent: 'space-between',
        alignItems: 'center',
        display: 'flex',
        cursor: 'pointer',
      }}
    >
      <theme.Checkbox
        checked={allSelected}
        onChange={() => {
          if (allSelected)
            tree.mutate(node.path, {
              values: [],
            })
          else
            tree.mutate(node.path, {
              values: node.values.concat(missingOptions),
            })
        }}
      />
      <div style={{ flex: 2, padding: '0 5px' }}>Select All</div>
    </label>
  )
})
SelectAll.displayName = 'SelectAll'

let FacetOptionsFilter = defaultTheme({
  Button: 'button',
  ButtonGroup: 'div',
  TextInput: 'input',
})(({ tree, node, theme }) => {
  let [val, setVal] = useState(node.optionsFilter)
  let buttonEnabled = val !== node.optionsFilter
  let submit = () =>
    buttonEnabled && tree.mutate(node.path, { optionsFilter: val })
  return (
    <Observer>
      {() => (
        <theme.ButtonGroup>
          <theme.TextInput
            value={val}
            onChange={e => {
              setVal(e.target.value)
            }}
            onKeyPress={e => e.key === 'Enter' && submit()}
            onBlur={submit}
            placeholder="Find..."
          />
          <theme.Button
            style={{ display: buttonEnabled ? 'block' : 'none' }}
            onClick={submit}
          >
            Submit
          </theme.Button>
        </theme.ButtonGroup>
      )}
    </Observer>
  )
})

let Facet = _.flow(
  defaultTheme({
    Checkbox,
    RadioList,
  }),
  contexturify
)(
  ({
    tree,
    node,
    hide = {},
    theme,
    display = x => x,
    displayBlank = () => <i>Not Specified</i>,
    formatCount = x => x,
  }) => (
    <div className="contexture-facet">
      <theme.RadioList
        value={node.mode || 'include'} // Fix by changing defaults in client example type
        onChange={mode => tree.mutate(node.path, { mode })}
        options={F.autoLabelOptions(['include', 'exclude'])}
      />
      {!hide.facetFilter && <FacetOptionsFilter {...{ tree, node, theme }} />}
      <SelectAll {...{ tree, node, theme }} />
      {_.map(({ name, count }) => {
        let lens = tree.lens(node.path, 'values')
        return (
          <label
            key={name}
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              display: 'flex',
              cursor: 'pointer',
            }}
          >
            <theme.Checkbox {...F.domLens.checkboxValues(name, lens)} />
            <div style={{ flex: 2, padding: '0 5px' }}>
              {display(name) || displayBlank()}
            </div>
            <div>{formatCount(count)}</div>
          </label>
        )
      }, _.get('context.options', node))}
      <Flex
        className="contexture-facet-cardinality"
        style={{ justifyContent: 'space-between' }}
      >
        {!!node.context.cardinality && (
          <div>
            Showing {_.min([node.size || 10, node.context.options.length])} of{' '}
            {node.context.cardinality}
          </div>
        )}
        {node.context.cardinality > (node.size || 10) && (
          <div>
            <a
              onClick={() =>
                tree.mutate(node.path, { size: (node.size || 10) + 10 })
              }
              style={{ cursor: 'pointer' }}
            >
              View More
            </a>
          </div>
        )}
      </Flex>
    </div>
  )
)
Facet.displayName = 'Facet'

export default Facet
