import React from 'react'
import ThemePicker from '../themePicker'
import ResultComponentStory from './resultComponents'
import SearchLayoutStory from './searchLayout'

export default { title: 'Live Demos | IMDB Search', decorators: [ThemePicker('greyVest')] }

export let customResultComponents = () => <ResultComponentStory />

export let dynamicSearchLayout = () => <SearchLayoutStory />
