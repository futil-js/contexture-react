import React from 'react'
import _ from 'lodash/fp'
import * as F from 'futil-js'
import { observer } from 'mobx-react'
import { contexturify, defaultTheme } from '../utils/hoc'
import { Popover as DefaultPopover, Dynamic } from '../layout'
import { withStateLens } from '../utils/mobx-react-utils'
import { fieldsToOptions } from '../FilterAdder'
import DefaultIcon from '../DefaultIcon'
import {
  applyDefaults,
  getRecord,
  getResults,
  inferSchema,
} from '../utils/schema'
import { newNodeFromField } from '../utils/search'

let getIncludes = (schema, node) =>
  F.when(_.isEmpty, _.map('field', schema))(node.include)

const moveColumn = (
  mutate,
  computeNextIndex,
  field,
  visibleFields,
  includes
) => {
  let visibleFieldIndex = _.findIndex({ field }, visibleFields)
  let nextField = _.flow(
    _.nth(computeNextIndex(visibleFieldIndex)),
    _.get('field')
  )(visibleFields)
  mutate({
    include: F.moveIndex(
      _.indexOf(field, includes),
      _.indexOf(nextField, includes),
      includes
    ),
  })
}

let popoverStyle = {
  userSelect: 'none',
}

let HighlightedColumnHeader = _.flow(
  observer,
  defaultTheme({ Cell: 'th' })
)(
  ({
    node,
    theme,
    results = _.result('slice', getResults(node)),
    hasAdditionalFields = !_.flow(
      _.map('additionalFields'),
      _.compact,
      _.isEmpty
    )(results),
  }) =>
    hasAdditionalFields && node.showOtherMatches ? (
      <theme.Cell key="additionalFields">Other Matches</theme.Cell>
    ) : null
)
HighlightedColumnHeader.displayName = 'HighlightedColumnHeader'

let labelForField = (schema, field) =>
  _.getOr(field, 'label', _.find({ field }, schema))

let HighlightedColumn = _.flow(
  observer,
  defaultTheme({
    Cell: 'td',
    Table: 'table',
    Modal: null,
  }),
  withStateLens({ viewModal: false })
)(
  ({
    node,
    results = _.result('slice', getResults(node)),
    additionalFields = _.result('0.additionalFields.slice', results),
    theme,
    viewModal,
    schema,
  }) =>
    _.isEmpty(additionalFields) ? (
      <theme.Cell key="additionalFields" />
    ) : (
      <theme.Cell key="additionalFields">
        {theme.Modal && (
          <theme.Modal isOpen={viewModal}>
            <h3>Other Matching Fields</h3>
            <theme.Table>
              <tbody>
                {_.map(
                  ({ label, value }) => (
                    <tr key={label}>
                      <td>{labelForField(schema, label)}</td>
                      <td dangerouslySetInnerHTML={{ __html: value }} />
                    </tr>
                  ),
                  additionalFields
                )}
              </tbody>
            </theme.Table>
          </theme.Modal>
        )}
        <button
          className="gv-link-button" // yikes! TODO TODO TODO
          onClick={e => {
            e.preventDefault()
            F.on(viewModal)()
          }}
        >
          Matched {_.size(additionalFields)} other field(s)
        </button>
      </theme.Cell>
    )
)
HighlightedColumn.displayName = 'HighlightedColumn'

let HeaderCellDefault = observer(({ activeFilter, style, children }) => (
  <th style={{ ...(activeFilter ? { fontWeight: 900 } : {}), ...style }}>
    {children}
  </th>
))
HeaderCellDefault.displayName = 'HeaderCellDefault'

let Header = _.flow(
  observer,
  defaultTheme({
    HeaderCell: HeaderCellDefault,
    Popover: DefaultPopover,
  }),
  withStateLens({ popover: false, adding: false, filtering: false }),
)(
  ({
    popover, adding, filtering, theme, typeComponents = {}, field: fieldSchema, includes, addOptions, addFilter, tree, node, mutate, criteria, mapNodeToProps, fields, visibleFields }) => {
    // Components (providerable?) // Contextual
    let {
      disableFilter,
      disableSort,
      field,
      label,
      hideMenu,
      typeDefault,
    } = fieldSchema
    let HeaderCell = fieldSchema.HeaderCell || theme.HeaderCell
    let filterNode =
      criteria &&
      _.find({ field }, _.getOr([], 'children', tree.getNode(criteria)))
    let filter = () => {
      if (!filterNode) addFilter(field)
      filterNode =
        criteria &&
        _.find({ field }, _.getOr([], 'children', tree.getNode(criteria)))
      tree.mutate(filterNode.path, { paused: false })
      F.flip(filtering)()
    }
    let Label = label
    return (
      <HeaderCell
        style={{ cursor: 'pointer' }}
        activeFilter={_.get('hasValue', filterNode)}
      >
        <span onClick={F.flip(popover)}>
          {_.isFunction(label) ? <Label /> : label}{' '}
          {field === node.sortField && (
            <theme.Icon
              icon={node.sortDir === 'asc' ? 'SortAscending' : 'SortDescending'}
            />
          )}
          {hideMenu ? null : <theme.Icon icon="TableColumnMenu" />}
        </span>
        <theme.Popover
          isOpen={{
            get() {
              return F.view(popover)
            },
            set(x) {
              // Only turn off the popover if adding is not true
              if (!F.view(adding) && _.isBoolean(x)) F.set(x)(popover)
            },
          }}
          style={popoverStyle}
        >
          {!disableSort && (
            <theme.Item
              onClick={() => {
                F.off(popover)()
                mutate({ sortField: field, sortDir: 'asc' })
              }}
            >
              <Icon icon="SortAscending" />
              Sort Ascending
            </theme.Item>
          )}
          {!disableSort && (
            <theme.Item
              onClick={() => {
                F.off(popover)()
                mutate({ sortField: field, sortDir: 'desc' })
              }}
            >
              <theme.Icon icon="SortDescending" />
              Sort Descending
            </theme.Item>
          )}
          <theme.Item
            onClick={() =>
              moveColumn(mutate, i => i - 1, field, visibleFields, includes)
            }
          >
            <theme.Icon icon="MoveLeft" />
            Move Left
          </theme.Item>
          <theme.Item
            onClick={() =>
              moveColumn(mutate, i => i + 1, field, visibleFields, includes)
            }
          >
            <Icon icon="MoveRight" />
            Move Right
          </theme.Item>
          <theme.Item
            onClick={() => mutate({ include: _.without([field], includes) })}
          >
            <theme.Icon icon="RemoveColumn" />
            Remove Column
          </theme.Item>
          {theme.Modal && theme.FieldPicker && !!addOptions.length && (
            <theme.Item onClick={F.on(adding)}>
              <Icon icon="AddColumn" />
              Add Column
            </theme.Item>
          )}
          {criteria && (typeDefault || filterNode) && !disableFilter && (
            <div>
              <theme.Item onClick={filter}>
                <theme.Icon
                  icon={
                    filterNode
                      ? F.view(filtering)
                        ? 'FilterCollapse'
                        : 'FilterExpand'
                      : 'FilterAdd'
                  }
                />
                Filter
              </theme.Item>
              {F.view(filtering) && filterNode && !filterNode.paused && (
                <Dynamic
                  component={typeComponents[filterNode.type]}
                  tree={tree}
                  path={_.toArray(filterNode.path)}
                  {...mapNodeToProps(filterNode, fields, typeComponents)}
                />
              )}
            </div>
          )}
          {theme.Modal && theme.FieldPicker && (
            <theme.Modal isOpen={adding}>
              <theme.FieldPicker
                options={addOptions}
                onChange={field => {
                  if (!_.contains(field, includes))
                    mutate({ include: [...includes, field] })
                  F.off(adding)()
                }}
              />
            </theme.Modal>
          )}
        </theme.Popover>
      </HeaderCell>
    )
  })
Header.displayName = 'Header'

// Separate this our so that the table root doesn't create a dependency on results to headers won't need to rerender on data change
let TableBody = _.flow(
  observer,
  defaultTheme({ Cell: 'td' })
)(
  ({
    node,
    visibleFields,
    fields,
    hiddenFields,
    theme,
    schema,
  }) => (
    <tbody>
      {!!getResults(node).length &&
        _.map(
          x => (
            <theme.Row
              key={x._id}
              record={getRecord(x)}
              {...{ fields, visibleFields, hiddenFields }}
            >
              {_.map(
                ({ field, display = x => x }) => (
                  <theme.Cell key={field}>
                    {display(_.get(field, getRecord(x)), getRecord(x))}
                  </theme.Cell>
                ),
                visibleFields
              )}
              {node.showOtherMatches && (
                <HighlightedColumn
                  {...{
                    node,
                    additionalFields: _.result('additionalFields.slice', x),
                    theme,
                    schema,
                  }}
                />
              )}
            </theme.Row>
          ),
          getResults(node)
        )}
    </tbody>
  )
)
TableBody.displayName = 'TableBody'

let Tr = props => (
  <tr
    {..._.omit(['record', 'fields', 'visibleFields', 'hiddenFields'], props)}
  />
)

let ResultTable = _.flow(
  defaultTheme({
    Table: 'table',
    Icon: DefaultIcon,
    Row: Tr,
  }),
  contexturify
)(
  ({
    fields,
    infer,
    path,
    criteria,
    node,
    tree,
    theme,
    typeComponents,
    mapNodeToProps = () => ({}),
  }) => {
    // From Theme/Components
    let mutate = tree.mutate(path)
    // NOTE infer + add columns does not work together (except for anything explicitly passed in)
    //   When removing a field, it's not longer on the record, so infer can't pick it up since it runs per render
    let schema = _.flow(
      _.merge(infer && inferSchema(node)),
      applyDefaults,
      _.values,
      _.orderBy('order', 'desc')
    )(fields)
    let includes = getIncludes(schema, node)
    let isIncluded = x => _.includes(x.field, includes)
    let visibleFields = _.flow(
      _.map(field => _.find({ field }, schema)),
      _.compact
    )(includes)
    let hiddenFields = _.reject(isIncluded, schema)

    let headerProps = {
      typeComponents,
      theme,
      mapNodeToProps,
      fields,
      visibleFields,
      includes,
      addOptions: fieldsToOptions(hiddenFields),
      addFilter: field =>
        tree.add(criteria, newNodeFromField({ field, fields })),
      tree,
      node,
      mutate,
      criteria,
    }

    return (
      <theme.Table>
        <thead>
          <tr>
            {F.mapIndexed(
              x => (
                <Header key={x.field} field={x} {...headerProps} />
              ),
              visibleFields
            )}
            <HighlightedColumnHeader node={node} />
          </tr>
        </thead>
        <TableBody
          {...{
            node,
            fields,
            visibleFields,
            hiddenFields,
            theme,
            schema,
          }}
        />
      </theme.Table>
    )
  }
)
ResultTable.displayName = 'ResultTable'

export default ResultTable
