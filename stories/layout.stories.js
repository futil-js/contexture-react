import React from 'react'
import F from 'futil-js'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { observer } from 'mobx-react'
import { fromPromise } from 'mobx-utils'
import { withStateLens } from '../src/utils/mobx-react-utils'
import Popover from '../src/layout/Popover'
import Modal from '../src/layout/Modal'
import Awaiter from '../src/layout/Awaiter'
import TextHighlight from '../src/layout/TextHighlight'
import { NestedPicker, ModalPicker } from '../src'

let PopoverButton = ({
  top,
  right,
  bottom,
  left,
  position = 'absolute',
  ...props
}) => (
  <button style={{ position, top, right, bottom, left }} {...props}>
    Open Popover
  </button>
)

let PopoverDemo = ({ anchor, isOpen }) => (
  <Popover
    anchor={anchor}
    isOpen={isOpen}
    position="bottom"
    style={{
      border: '1px solid',
      padding: 5,
      margin: 5,
      maxWidth: 200,
      background: 'white',
    }}
  >
    {lipsum}
  </Popover>
)

let ControlledPopover = withStateLens({ isOpen: false })(
  observer(({ isOpen, withAnchor = false }) => (
    <>
      {!withAnchor && (
        <PopoverButton position="relative" onClick={F.on(isOpen)} />
      )}
      <PopoverDemo
        isOpen={isOpen}
        anchor={withAnchor && <PopoverButton onClick={F.on(isOpen)} />}
      />
    </>
  ))
)

let lipsum =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

storiesOf('Components (Unthemed)|Layout/Popover', module)
  .addWithJSX('Uncontrolled with anchor', () => (
    <PopoverDemo anchor={<PopoverButton />} />
  ))
  .addWithJSX('Controlled with anchor', () => <ControlledPopover withAnchor />)
  .addWithJSX('(Legacy) Controlled with no anchor', () => <ControlledPopover />)
  .addWithJSX('Dynamic Positioning', () => (
    <>
      <PopoverDemo anchor={<PopoverButton top={10} left={10} />} />
      <PopoverDemo anchor={<PopoverButton top={10} left={'50%'} />} />
      <PopoverDemo anchor={<PopoverButton top={10} right={10} />} />
      <PopoverDemo anchor={<PopoverButton bottom={10} left={10} />} />
      <PopoverDemo anchor={<PopoverButton bottom={10} left={'50%'} />} />
      <PopoverDemo anchor={<PopoverButton bottom={10} right={10} />} />
      <PopoverDemo anchor={<PopoverButton left={10} top={'50%'} />} />
      <PopoverDemo anchor={<PopoverButton right={10} top={'50%'} />} />
      <div
        style={{
          overflow: 'auto',
          height: 200,
          width: 400,
          top: '40%',
          left: '40%',
          position: 'absolute',
          background: 'rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ width: '100%', height: 800 }}>
          <PopoverDemo anchor={<PopoverButton left={'30%'} top={'40%'} />} />
        </div>
      </div>
    </>
  ))

let ModalDemo = withStateLens({ isOpen: false })(
  observer(({ isOpen }) => (
    <div>
      <Modal isOpen={isOpen}>Some Modal Content</Modal>
      <button onClick={F.on(isOpen)}>Open Modal</button>
    </div>
  ))
)

let HighlightDemo = withStateLens({ filter: '' })(
  observer(({ filter }) => (
    <div>
      <div>
        <input {...F.domLens.value(filter)} />
      </div>
      <TextHighlight text={lipsum} pattern={F.view(filter)} />
    </div>
  ))
)

storiesOf('Components (Unthemed)|Layout', module)
  .addWithJSX('Modal', () => <ModalDemo />)
  .addWithJSX('Highlight', () => <HighlightDemo />)
  .addWithJSX('Awaiter', () => {
    let resolve
    let reject
    let p = fromPromise(
      new Promise((_resolve, _reject) => {
        resolve = _resolve
        reject = _reject
      })
    )
    return (
      <div>
        <Awaiter promise={p}>{x => <div>{x}</div>}</Awaiter>
        <button onClick={() => resolve('async value')}>Resolve</button>
        <button onClick={() => reject('some error')}>Reject</button>
      </div>
    )
  })
  .addWithJSX('NestedPicker', () => (
    <NestedPicker
      options={['abcd', 'bcde', 'cdef'].map(x => ({ label: x, value: x }))}
      onChange={action(`picked`)}
    />
  ))
  .addWithJSX('ModalPicker', () => (
    <ModalPicker
      options={['abcd', 'bcde', 'cdef'].map(x => ({ label: x, value: x }))}
      onChange={action('picked')}
      label="Pick"
      Picker={NestedPicker}
      Modal={Modal}
    />
  ))
