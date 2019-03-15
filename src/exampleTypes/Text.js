import { inject } from 'mobx-react'
import LensInput from '../layout/LensInput'

export default inject((context, { tree, node, prop = 'value' }) => ({
  lens: tree.lens(node.path, prop),
}))(LensInput)
