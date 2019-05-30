import { useState } from 'react'

export let useStateLens = value => {
  let [state, setState] = useState(value)
  return { get: () => state, set: setState }
}
