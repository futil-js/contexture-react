import React from 'react'
import { greyVest } from '../themes/index.js'
import { ThemeContext, useTheme } from './hooks.js'

export { useTheme } from './hooks.js'

export let ThemeProvider = ({ theme, children }) => {
  theme = { ...greyVest, ...theme }
  let Root = theme.Root || React.Fragment
  return (
    <ThemeContext.Provider value={theme}>
      <Root>{children}</Root>
    </ThemeContext.Provider>
  )
}

export let ThemeConsumer = ({ children, theme }) => children(useTheme(theme))

/**
 * @deprecated
 */
export let withTheme =
  (Component) =>
  ({ theme, ...props }) =>
    <Component theme={useTheme(theme)} {...props} />
