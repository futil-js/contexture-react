import React from 'react'
import { greyVest } from '../themes/index.js'

let ThemeContext = React.createContext()

export let ThemeProvider = ({ theme, children }) => {
  theme = { ...greyVest, ...theme }
  let Root = theme.Root || React.Fragment
  return (
    <ThemeContext.Provider value={theme}>
      <Root>{children}</Root>
    </ThemeContext.Provider>
  )
}

export let useTheme = () => React.useContext(ThemeContext)

export let ThemeConsumer = ({ children, theme }) =>
  children({ ...useTheme(), ...theme })

export let withTheme =
  (Component) =>
  ({ theme, ...props }) =>
    <Component theme={{ ...useTheme(), ...theme }} {...props} />
