import React from 'react'
import _ from 'lodash/fp'
import { contexturify } from '../utils/hoc'

let DateComponent = ({ tree, node, ranges, theme: { Select } }) => (
  <Select
    value={_.flow(
      _.find(_.pick(['from', 'to'], node)),
      _.get('label')
    )(ranges)}
    onChange={label =>
      label &&
      tree.mutate(
        node.path,
        _.flow(
          _.find({ label }),
          _.pick(['from', 'to'])
        )(ranges)
      )
    }
    options={_.map(({ label }) => ({ label, value: label }), ranges)}
  />
)
DateComponent.displayName = 'DateRangePicker'

export default contexturify(DateComponent)
