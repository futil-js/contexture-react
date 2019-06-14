import React from 'react'
import { storiesOf } from '@storybook/react'
import decorator from './decorator'
import { Flex } from './../../src/layout/Flex'
import {
  Box,
  ErrorList,
  ErrorBlockList,
  Input,
} from './../../src/themes/greyVest'

storiesOf('Components (Grey Vest)|Error', module)
  .addDecorator(decorator)
  .addWithJSX('Text', () => <ErrorList>I am an error</ErrorList>)
  .addWithJSX('Block', () => (
    <ErrorBlockList>
      {['Error 1', 'Error 2', ['Error 3A', 'Error 3B']]}
    </ErrorBlockList>
  ))
  .addWithJSX('Empty', () => (
    <>
      <ErrorList />
      <ErrorBlockList />
    </>
  ))
  .addWithJSX('Styled', () => (
    <>
      <ErrorList style={{ color: 'forestgreen' }}>
        Ceci n'est pas une error
      </ErrorList>
      <ErrorBlockList
        style={{
          fontWeight: 800,
          fontSize: '2em',
          textTransform: 'uppercase',
        }}
      >
        Extremely loud error
      </ErrorBlockList>
    </>
  ))
  .addWithJSX('Form Demo', () => (
    <Box>
      <h1 style={{ margin: '15px 0' }}>Header</h1>
      <ErrorBlockList>Block error</ErrorBlockList>
      <Flex column style={{ marginBottom: 25 }}>
        <Flex as="label" column style={{ flex: 1 }}>
          <div className="filter-field-label" style={{ marginBottom: 14 }}>
            Label
          </div>
          <Input style={{ borderColor: '#D75050' }} />
        </Flex>
        <ErrorList>Text error</ErrorList>
      </Flex>
    </Box>
  ))
  .addWithJSX('Custom Component', () => {
    let Marquee = ({ children, ...props }) => (
      <marquee
        style={{
          width: 160,
          backgroundColor: 'black',
          color: 'white',
        }}
        {...props}
      >
        {children}
      </marquee>
    )
    return (
      <ErrorList Component={Marquee}>
        {['First error', 'Second error', 'Third error']}
      </ErrorList>
    )
  })
