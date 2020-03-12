import React from 'react'
import F from 'futil'
import { contexturify } from '../utils/hoc'

let Query = ({ tree, node, theme: { TextInput } }) => (
  <TextInput
    {...F.domLens.value(tree.lens(node.path, 'query'))}
    placeholder="Search"
  />
)

export default contexturify(Query)
