import _ from 'lodash/fp.js'
import F from 'futil'
import React from 'react'
import { observer } from 'mobx-react'
import { useNode, useTheme } from '../utils/hooks.js'
import { ExpandableTable, Column, Flex } from '../greyVest/index.js'

let toolBarStyle = { justifyContent: 'space-between', alignItems: 'center' }

let SimpleLabel = ({ text }) => (
  <label style={{ paddingRight: '5px' }}>{text}</label>
)

let SimpleFilter = ({ theme, ...props }) => (
  <Flex style={{ ...toolBarStyle, width: '75%' }}>
    <SimpleLabel text="Filter:" />
    <theme.TextInput {...props} />
  </Flex>
)

let SelectSize = observer(function SelectSize({
  node,
  tree,
  theme,
  options = [10, 25, 50, 100, 500, 1000],
}) {
  return (
    <Flex style={{ marginLeft: 12, ...toolBarStyle }}>
      <SimpleLabel text="Size:" />
      <theme.Select
        onChange={(e) => {
          tree.mutate(node.path, { size: e.target.value })
        }}
        value={_.getOr(25, 'size', node)}
        placeholder={null}
        style={{ width: '100px' }}
        options={_.map((x) => ({ value: x, label: x }), options)}
      />
    </Flex>
  )
})

export default observer(function TermsStatsTable({
  node,
  path,
  tree,
  criteria,
  criteriaField,
  criteriaFieldLabel = '',
  criteriaGetValue = _.identity,
  children,
  sizeOptions,
  limitedResults,
  theme,
  ...props
}) {
  node = useNode(node, path, tree)
  theme = useTheme(theme)
  return (
    <theme.Loader loading={node.updating}>
      <div>
        <Flex style={{ ...toolBarStyle, margin: '0 8px' }}>
          <SimpleFilter
            theme={theme}
            {...F.domLens.value(tree.lens(node.path, 'filter'))}
          />
          <SelectSize
            node={node}
            tree={tree}
            options={sizeOptions}
            theme={theme}
          />
        </Flex>
        <ExpandableTable
          {...{
            ...props,
            children: criteria
              ? [
                  ..._.compact(children),
                  <Column
                    key="checkbox"
                    label={criteriaFieldLabel}
                    expand={{
                      display: (value, record) => (
                        <div>
                          <theme.Button
                            onClick={async () => {
                              let field = criteriaField || node.key_field
                              let filter =
                                criteria &&
                                _.find(
                                  { field },
                                  tree.getNode(criteria).children
                                )
                              if (
                                !filter ||
                                _.get('mode', filter) === 'exclude'
                              ) {
                                await tree.add(criteria, {
                                  field,
                                  type: 'facet',
                                })
                                filter = _.findLast(
                                  { field },
                                  tree.getNode(criteria).children
                                )
                              }
                              await tree.mutate(filter.path, {
                                mode: 'include',
                                values: _.uniq([
                                  ..._.getOr([], 'values', filter),
                                  criteriaGetValue(record.key),
                                ]),
                              })
                            }}
                          >
                            Add as Filter
                          </theme.Button>
                        </div>
                      ),
                    }}
                  />,
                ]
              : _.compact(children),
          }}
          data={node.context.terms}
          sortField={node.order}
          sortDir={node.sortDir}
          columnSort={(column) => {
            if (column.field !== 'key' && column.enableSort) {
              tree.mutate(node.path, {
                order: column.field,
                sortDir: column.sortDir,
              })
            }
          }}
          blankRows={limitedResults}
          pageSize={node.size}
        />
      </div>
    </theme.Loader>
  )
})
