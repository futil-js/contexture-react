import React from 'react'
import * as F from 'futil-js'
import { defaultTheme } from '../utils/hoc'

// Since start and end are the same token, splitting on it means every even element was a match
let TextHighlight = defaultTheme({ Wrap: 'i' })(({ pattern, text, theme }) =>
  pattern
    ? F.highlight('<>', '<>', pattern, text)
        .split('<>')
        .map((x, i) => (i % 2 ? <theme.Wrap key={i}>{x}</theme.Wrap> : x))
    : text
)
TextHighlight.displayName = 'TextHighlight'

export default TextHighlight
