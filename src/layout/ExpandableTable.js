import _ from 'lodash/fp'
import * as F from 'futil-js'
import React from 'react'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import { applyDefaults, inferSchema } from '../utils/schema'

let ExpandableTable = inject((__, { tree, criteria, infer, fields, node, path }) => {
  if (!node) node = tree.getNode(path)
  let schema = _.flow(
    _.merge(infer && inferSchema(node)),
    applyDefaults,
    _.values,
    _.orderBy('order', 'desc')
  )(fields)

  let state = {
    filterState: observable({
      filter: node.filter,
    }),
    node,
    expanded: observable(new Map()),
    onClick(field, keyField, record, index, details) {
      let key = record[keyField]
      let indexedField = `${field}${index}`

      if (_.get('indexedField', state.expanded.get(key)) !== indexedField) {
        state.expanded.set(key, {
          key,
          record,
          field,
          indexedField,
          details,
        })
      } else {
        state.expanded.delete(key)
      }
    },
    getCriteriaFilter: field => criteria && _.find({ field }, tree.getNode(criteria).children),
    async createFilter(field) {
      await tree.add(criteria, {
        key: _.uniqueId('add'),
        field,
        type: _.find({ field }, schema).typeDefault,
      })
      return state.getCriteriaFilter(field)
    },
    async mutateFilter(e) {
      let filter = state.getCriteriaFilter(state.node.key_field) || await state.createFilter(state.node.key_field)
      let value = e.target.value

      // Do we need this?
      // await tree.mutate(filter.path, {
      //   optionsFilter: e.target.value
      // })

      // This is not causing a new search
      await tree.mutate(path, {
        filter: value
      })
      // This works (causes a warning that can be prevented by separating the input into a new observable or something),
      // but still doesn't run a new search
      state.filterState.filter = value
    }
  }
  return state
})(
  observer(
    ({ data, columns, recordKey = 'key', expanded, onClick, mutateFilter, filterState, ...props }) => console.log('RERENDERING') || (
      <div>
        Filter: <input type="text" value={filterState.filter} onChange={mutateFilter} />
        <br />
        <table {...props.tableAttrs}>
          <thead>
            <tr>
              {F.mapIndexed(
                (c, i) => (
                  <th key={`${c.field}${i}`}>
                    {F.callOrReturn(_.getOr(F.autoLabel(c.field), 'label', c))}
                  </th>
                ),
                columns
              )}
              <th>Controls</th>
            </tr>
          </thead>
          <tbody>
            {_.map(
              x => (
                <React.Fragment key={x[recordKey]}>
                  <tr {...x.rowAttrs} key={x[recordKey]}>
                    {F.mapIndexed(
                      ({ field, display = x => x, details = {} }, i) => (
                        <td
                          key={`${field}${i}`}
                          {...!_.isEmpty(details) && {
                            style: {
                              cursor: !_.isEmpty(details) ? 'pointer' : 'auto',
                            },
                            onClick: () =>
                              onClick(field, recordKey, x, i, details),
                          }}
                        >
                          {_.getOr(
                            display,
                            `${
                              _.isEqual(
                                _.get('indexedField', expanded.get(x[recordKey])),
                                `${field}${i}`
                              )
                                ? 'collapse'
                                : 'expand'
                            }.display`,
                            details
                          )(_.get(field, x), x)}
                        </td>
                      ),
                      columns
                    )}
                    <td>
                      Thy controls
                    </td>
                  </tr>
                  {/* See if there is a details component to render for the column value when row expanded */}
                  {_.flow(
                    key => expanded.get(key),
                    expandedRow =>
                      _.get('details.Component', expandedRow) && (
                        <tr>
                          <td colSpan={columns.length}>
                            {expandedRow.details.Component(
                              _.get(expandedRow.field, expandedRow.record),
                              expandedRow.record
                            )}
                          </td>
                        </tr>
                      )
                  )(x[recordKey])}
                </React.Fragment>
              ),
              data
            )}
          </tbody>
        </table>
      </div>
    )
  )
)

ExpandableTable.displayName = 'ExpandableTable'

export default ExpandableTable
