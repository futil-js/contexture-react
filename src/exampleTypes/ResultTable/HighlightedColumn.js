import React from 'react'
import _ from 'lodash/fp.js'
import F from 'futil'
import { observer } from 'mobx-react'
import { getResults } from '../../utils/schema.js'
import { useTheme } from '../../utils/hooks.js'

let labelForField = (schema, field) =>
  _.getOr(field, 'label', _.find({ field }, schema))

export default observer(function HighlightedColumn({
  node,
  results = _.result('slice', getResults(node)),
  additionalFields = _.result('0.additionalFields.slice', results),
  schema,
  theme,
  Cell,
}) {
  theme = useTheme(theme)
  Cell ||= theme.Td
  let viewModal = React.useState(false)
  return _.isEmpty(additionalFields) ? (
    <Cell key="additionalFields" />
  ) : (
    <Cell key="additionalFields">
      <theme.Modal open={viewModal}>
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
      <button
        className="gv-link-button"
        onClick={(e) => {
          e.preventDefault()
          F.on(viewModal)()
        }}
      >
        Matched {_.size(additionalFields)} other field(s)
      </button>
    </Cell>
  )
})
