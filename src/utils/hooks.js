import React from 'react'

export const useNode = (node, path, tree) => {
  node = node || (tree && path && tree.getNode(path))
  if (!node) throw Error(`Node not provided, and couldn't find node at ${path}`)
  return node
}

export const ThemeContext = React.createContext()

export const useTheme = (theme) => {
  let context = React.useContext(ThemeContext)
  return { ...context, ...theme }
}
