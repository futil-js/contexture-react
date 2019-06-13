import React from 'react'
import { configure, setAddon, addDecorator } from '@storybook/react'
import JSXAddon from 'storybook-addon-jsx'
import 'babel-polyfill'

setAddon(JSXAddon)

function loadStories() {
  const req = require.context('../stories', true, /\.stories\.js$/)
  req.keys().forEach(filename => req(filename))
}

// https://github.com/storybookjs/storybook/issues/5721#issuecomment-481649571
addDecorator(Story => <Story />)

configure(loadStories, module)
