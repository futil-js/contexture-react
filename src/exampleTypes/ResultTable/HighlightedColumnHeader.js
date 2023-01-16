import React from 'react'
import _ from 'lodash/fp.js'
import { observer } from 'mobx-react'
import { getResults } from '../../utils/schema.js'
import { useTheme } from '../../utils/hooks.js'

export default observer(function HighlightedColumnHeader({
  node,
  results = _.result('slice', getResults(node)),
  theme,
  Cell,
  hasAdditionalFields = !_.flow(
    _.map('additionalFields'),
    _.compact,
    _.isEmpty
  )(results),
}) {
  theme = useTheme(theme)
  Cell ||= theme.Th
  return hasAdditionalFields && node.showOtherMatches ? (
    <Cell key="additionalFields">Other Matches</Cell>
  ) : null
})
