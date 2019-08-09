import _ from 'lodash/fp'
import { contexturify, defaultTheme, withTreeLens } from '../utils/hoc'
import LensInput from '../layout/LensInput'

let Text = _.flow(
  withTreeLens,
  contexturify,
  defaultTheme({ Input: 'input' })
)(LensInput)
Text.displayName = 'Text'

export default Text
