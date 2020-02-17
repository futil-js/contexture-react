import React from 'react'
import { Fonts } from 'grey-vest'
import ThemeStyle from './Style'

let Root = ({ children }) => (
  <>
    <Fonts />
    <ThemeStyle />
    {children}
  </>
)

export default Root
