import F from 'futil-js'
import _ from 'lodash/fp'

// Wrapper around native addEventListener that returns disposer function
export let addEventListener = (event, listener, node) => {
  node.addEventListener(event, listener)
  return () => node.removeEventListener(event, listener)
}

export let setNodeStyles = (styles, node) =>
  F.eachIndexed(
    (v, k) => node.style.setProperty(k, _.isNumber(v) ? `${v}px` : v),
    styles
  )
