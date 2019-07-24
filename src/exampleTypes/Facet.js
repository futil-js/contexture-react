import React, { useState } from 'react'
import _ from 'lodash/fp'
import F from 'futil-js'
import { observer, Observer } from 'mobx-react'
import { exampleTypes } from 'contexture-client'
import { Flex } from '../layout/Flex'
import injectTreeNode from '../utils/injectTreeNode'

let ceilTens = _.partial(_.ceil.convert({fixed: false}), [_, -1])

let CheckboxDefault = props => <input type="checkbox" {...props} />
let RadioListDefault = ({ value, onChange, options }) => (
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

let SelectAll = observer(({ node, tree, Checkbox }) => {
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
      <Checkbox
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

let FacetOptionsFilter = ({ tree, node, TextInput, Button, ButtonGroup }) => {
  let [val, setVal] = useState(node.optionsFilter)
  let buttonEnabled = val !== node.optionsFilter
  let submit = () =>
    buttonEnabled && tree.mutate(node.path, { optionsFilter: val })
  return (
    <Observer>
      {() => (
        <ButtonGroup>
          <TextInput
            value={val}
            onChange={e => {
              setVal(e.target.value)
            }}
            onKeyPress={e => e.key === 'Enter' && submit()}
            onBlur={submit}
            placeholder="Find..."
          />
          <Button
            style={{ display: buttonEnabled ? 'block' : 'none' }}
            onClick={submit}
          >
            Submit
          </Button>
        </ButtonGroup>
      )}
    </Observer>
  )
}

let Facet = injectTreeNode(
  observer(
    ({
      tree,
      node,
      hide = {},
      TextInput = 'input',
      Button = 'button',
      Checkbox = CheckboxDefault,
      RadioList = RadioListDefault,
      display = x => x,
      displayBlank = () => <i>Not Specified</i>,
      formatCount = x => x,
      ButtonGroup = 'div',
      minSize = 10,
      sizeIncrement = 10,
    }) => (
      <div className="contexture-facet">
        <RadioList
          value={node.mode || 'include'} // Fix by changing defaults in client example type
          onChange={mode => tree.mutate(node.path, { mode })}
          options={F.autoLabelOptions(['include', 'exclude'])}
        />
        {!hide.facetFilter && (
          <FacetOptionsFilter
            tree={tree}
            node={node}
            TextInput={TextInput}
            Button={Button}
            ButtonGroup={ButtonGroup}
          />
        )}
        <SelectAll node={node} tree={tree} Checkbox={Checkbox} />
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
              <Checkbox {...F.domLens.checkboxValues(name, lens)} />
              <div style={{ flex: 2, padding: '0 5px' }}>
                {display(name) || displayBlank()}
              </div>
              <div>{formatCount(count)}</div>
            </label>
          )
        }, _.get('context.options', node))}
        {!!node.context.cardinality && (
          <Flex
            className="contexture-facet-cardinality"
            justifyContent="space-between"
          >
            <div>
              Showing {_.min([node.size || minSize, node.context.options.length])} of{' '}
              {node.context.cardinality}
            </div>
            <div>
              {_.flow(
                _.compact,
                F.intersperse(' — ')
              )([
                _.min([node.size, node.context.options.length]) > minSize && (
                  <a
                    key="less"
                    onClick={() =>
                      tree.mutate(node.path, { 
                        size: _.max([
                          _.min([
                            node.size,
                            ceilTens(node.context.options.length)
                          ]) - sizeIncrement,
                          minSize
                        ])
                      })
                    }
                    style={{ cursor: 'pointer' }}
                  >
                    View Less
                  </a>
                ),
                node.context.cardinality > (node.size || minSize) && (
                  <a
                    key="more"
                    onClick={() =>
                      tree.mutate(node.path, { size: (node.size || minSize) + sizeIncrement })
                    }
                    style={{ cursor: 'pointer' }}
                  >
                    View More
                  </a>
                )
              ])}
            </div>
          </Flex>
        )}
      </div>
    )
  ),
  exampleTypes.facet
)
Facet.displayName = 'Facet'

export default Facet
