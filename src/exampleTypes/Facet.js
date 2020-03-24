import React from 'react'
import _ from 'lodash/fp'
import F from 'futil'
import { setDisplayName } from 'recompose'
import { observer } from 'mobx-react'
import { Flex, Grid } from 'grey-vest'
import { contexturify } from '../utils/hoc'
import { withTheme } from '../utils/theme'

export let Cardinality = _.flow(
  setDisplayName('Cardinality'),
  observer
)(({ node, tree }) =>
  _.get('context.cardinality', node) ? (
    <Flex
      className="contexture-facet-cardinality"
      justifyContent="space-between"
    >
      <div>
        Showing {_.min([node.size || 10, _.size(node.context.options)])} of{' '}
        {node.context.cardinality}
      </div>
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
  ) : null
)

let SelectAll = _.flow(
  setDisplayName('SelectAll'),
  observer,
  withTheme
)(({ node, tree, theme: { Checkbox } }) => {
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

let FacetOptionsFilter = _.flow(
  setDisplayName('FacetOptionsFilter'),
  observer,
  withTheme
)(({ tree, node, theme: { TextInput, Button, ButtonGroup } }) => {
  let [val, setVal] = React.useState(node.optionsFilter)
  let buttonEnabled = val !== node.optionsFilter
  let submit = () =>
    buttonEnabled && tree.mutate(node.path, { optionsFilter: val })
  return (
    <ButtonGroup>
      <TextInput
        value={val}
        onChange={setVal}
        onKeyPress={e => e.key === 'Enter' && submit()}
        onBlur={submit}
        placeholder="Search..."
      />
      <Button primary={node.optionsFilter !== val} onClick={submit}>
        Find
      </Button>
    </ButtonGroup>
  )
})

let getOptions = node =>
  _.flow(
    _.get('context.options'),
    _.partition(x => _.includes(x.name, node.values)),
    _.flatten
  )(node)

let Facet = ({
  tree,
  node,
  hide = {
    facetFilter: false, // Hide the search box above the facet checkboxes
    counts: false, // Hide the facet counts so only the labels are displayed
  },
  display = x => x,
  displayBlank = () => <i>Not Specified</i>,
  formatCount = x => x,
  theme: { CheckboxList, RadioList },
}) => {
  let lens = tree.lens(node.path, 'values')
  let options = getOptions(node)
  return (
    <Grid className="contexture-facet" gap="sm">
      <RadioList
        value={node.mode || 'include'} // Fix by changing defaults in client example type
        onChange={mode => tree.mutate(node.path, { mode })}
        options={F.autoLabelOptions(['include', 'exclude'])}
        columnCount={2}
      />
      {!hide.facetFilter && <FacetOptionsFilter tree={tree} node={node} />}
      <SelectAll node={node} tree={tree} />
      <CheckboxList
        options={_.map(
          ({ name, count }) => ({
            label: (
              <Flex justifyContent="space-between" gap="xs">
                <span>{display(name) || displayBlank()}</span>
                <span>{!hide.counts && formatCount(count)}</span>
              </Flex>
            ),
            value: name,
          }),
          options
        )}
        {...F.domLens.value(lens)}
      />
      <Cardinality {...{ node, tree }} />
    </Grid>
  )
}

export default contexturify(Facet)
