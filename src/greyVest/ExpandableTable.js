import _ from 'lodash/fp.js'
import F from 'futil'
import React from 'react'
import { observable } from '../utils/mobx.js'
import { observer } from 'mobx-react'
import { addBlankRows, blankResult } from '../utils/format.js'
import { useTheme } from '../utils/hooks.js'

export let Column = _.identity
Column.displayName = 'Column'

let ExpandedSection = observer(
  ({ columnCount, expandedRow }) =>
    _.getOr(null, 'details.Component', expandedRow) && (
      <tr align="center">
        <td colSpan={columnCount}>
          {expandedRow.details.Component(
            _.get(expandedRow.field, expandedRow.record),
            expandedRow.record
          )}
        </td>
      </tr>
    )
)

let TableBodyState = () => {
  let state = observable({
    expanded: new Map(),
    onClick(field, keyField, record, index, details) {
      let key = record[keyField]
      let indexedField = `${field}${index}`

      if (
        _.get('indexedField', state.expanded.get(key)) !== indexedField &&
        !record.isBlank
      ) {
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
  })

  return state
}

let TableBody = observer(
  ({ data, columns, recordKey, blankRows, pageSize }) => {
    let rows = blankRows ? addBlankRows(data, pageSize, recordKey) : data
    let [{ expanded, onClick }] = React.useState(TableBodyState)
    return (
      <tbody>
        {_.map(
          (x) => (
            <React.Fragment key={x[recordKey]}>
              <tr
                {...x.rowAttrs}
                className={
                  _.getOr('', 'rowAttrs.className', x) +
                  (expanded.has(x[recordKey]) ? 'expanded' : '')
                }
              >
                {F.mapIndexed(
                  ({ field, display = (x) => x, details = {} }, i) => (
                    <td
                      key={`${field}${i}`}
                      {...(!_.isEmpty(details) && {
                        style: {
                          cursor: !_.isEmpty(details) ? 'pointer' : 'auto',
                        },
                        onClick: () =>
                          onClick(field, recordKey, x, i, details, expanded),
                      })}
                    >
                      {F.when(
                        () => x.isBlank,
                        blankResult,
                        _.getOr(
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
                        )
                      )(_.get(field, x), x)}
                    </td>
                  ),
                  columns
                )}
              </tr>
              {/* See if there is a details component to render for the column value when row expanded */}
              {expanded.has(x[recordKey]) && (
                <ExpandedSection
                  expandedRow={expanded.get(x[recordKey])}
                  columnCount={columns.length}
                />
              )}
            </React.Fragment>
          ),
          rows
        )}
      </tbody>
    )
  }
)

let TableState = (props) => ({
  columns: _.map(
    ({ props }) => ({
      ..._.pick(['field', 'label', 'display', 'enableSort'], props),
      details: F.compactObject({
        ..._.pick(['expand', 'collapse'], props),
        Component: props.children,
      }),
    }),
    _.castArray(props.children)
  ),
})

let ExpandableTable = ({
  data,
  recordKey = 'key',
  columnSort = _.identity,
  theme,
  ...props
}) => {
  let { Table, Icon, Popover, DropdownItem } = useTheme(theme)
  let [{ columns }] = React.useState(() => observable(TableState(props)))
  return (
    <Table {...props.tableAttrs}>
      <thead>
        <tr>
          {F.mapIndexed(
            (c, i) => (
              <th
                key={`${c.field}${i}`}
                {...(c.enableSort && {
                  style: { cursor: 'pointer' },
                })}
              >
                <span>
                  {F.callOrReturn(_.getOr(F.autoLabel(c.field), 'label', c))}
                  {c.enableSort && (
                    <Popover
                      trigger={<Icon icon="TableColumnMenu" />}
                      position={`bottom ${
                        i === columns.length - 1 ? 'right' : 'center'
                      }`}
                      style={{
                        userSelect: 'none',
                        width: 'auto',
                      }}
                    >
                      <DropdownItem
                        onClick={() => columnSort({ ...c, sortDir: 'asc' })}
                      >
                        <Icon icon="SortAscending" />
                        Sort Ascending
                      </DropdownItem>
                      <DropdownItem
                        onClick={() => columnSort({ ...c, sortDir: 'desc' })}
                      >
                        <Icon icon="SortDescending" />
                        Sort Descending
                      </DropdownItem>
                    </Popover>
                  )}
                </span>
              </th>
            ),
            columns
          )}
        </tr>
      </thead>
      <TableBody
        columns={columns}
        data={data}
        recordKey={recordKey}
        {...props}
      />
    </Table>
  )
}

export default observer(ExpandableTable)
