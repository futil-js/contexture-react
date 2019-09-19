import React from 'react'
import F from 'futil-js'
import { storiesOf } from '@storybook/react'
import ThemePicker from './stories/themePicker'
import { SearchLayout } from '.'
import { useTheme } from './utils/theme'
import { useSearchLayout } from './SearchLayout'

let Filters = () => {
  let { Box, Button } = useTheme()
  let layout = useSearchLayout()
  let toggle = F.view(layout) === 'builder' ? 'basic' : 'builder'
  return F.view(layout) === 'resultsOnly' ? null : (
    <Box>
      Filters
      <Button onClick={F.sets(toggle, layout)} style={{ float: 'right' }}>
        {toggle}
      </Button>
    </Box>
  )
}

let Results = () => {
  let { Box, Button } = useTheme()
  let layout = useSearchLayout()
  let toggle = F.view(layout) === 'resultsOnly' ? 'basic' : 'resultsOnly'
  return (
    <Box>
      Results
      <Button onClick={F.sets(toggle, layout)} style={{ float: 'right' }}>
        {toggle}
      </Button>
    </Box>
  )
}

storiesOf('Components|Search Components/SearchLayout', module)
  .addDecorator(ThemePicker('greyVest'))
  .addWithJSX('Controlled', () => {
    let { Button } = useTheme()
    let [mode, setMode] = React.useState('basic')
    return (
      <>
        <div style={{ display: 'flex', margin: 40 }}>
          <Button onClick={() => setMode('basic')}>basic</Button>
          <Button onClick={() => setMode('builder')}>builder</Button>
          <Button onClick={() => setMode('resultsOnly')}>results only</Button>
        </div>
        <SearchLayout mode={mode} setMode={setMode}>
          <Filters />
          <Results />
        </SearchLayout>
      </>
    )
  })
  .addWithJSX('Uncontrolled', () => {
    let { Button } = useTheme()
    let [toggle, setToggle] = React.useState(false)
    return (
      <>
        <div style={{ margin: 40 }}>
          Rerendering the layout should not reset it
          <Button onClick={() => setToggle(!toggle)}>Rerender</Button>
        </div>
        {/* The style prop ensures we re-render SearchLayout */}
        <SearchLayout style={{ marginTop: 0 }}>
          <Filters />
          <Results />
        </SearchLayout>
      </>
    )
  })
