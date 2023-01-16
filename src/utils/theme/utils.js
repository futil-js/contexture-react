import React from 'react'
import { useTheme } from '../hooks.js'

export { useTheme } from '../hooks.js'

/**
 * @deprecated
 */
export let ThemeConsumer = ({ children, theme }) => children(useTheme(theme))

/**
 * @deprecated
 */
export let withTheme =
  (Component) =>
  ({ theme, ...props }) =>
    <Component theme={useTheme(theme)} {...props} />
