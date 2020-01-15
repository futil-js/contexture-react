import React from 'react'
import { Fonts, Style } from 'grey-vest'
import ThemeStyle from './Style'

let Root = ({ children }) => (
  <>
    <Fonts />
    <Style />
    <ThemeStyle />
    {children}
  </>
)

export default Root
