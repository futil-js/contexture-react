import * as F from 'futil-js'
import React from 'react'
import { observer } from 'mobx-react'
import Popover from './Popover'
import Flex from './Flex'

// TODO: Probably accept any input, and default to this
import { Input } from 'contexture-react/dist/themes/greyVest'

let Option = ({ style, onClick, children }) => (
  <div
    style={{
      cursor: 'pointer',
      borderBottom: '2px solid #f1f1f1',
      width: '100%',
      padding: '10px 0px',
      height: '18px',
      ...style,
    }}
    onClick={onClick}
  >
    {children}
  </div>
)

export default observer(
  ({
    results,
    placeholder,
    onChange,
    onSelect,
    currentValue,
    getValue,
    getName,
    isOpen,
  }) => (
    <div>
      <Input
        onChange={onChange}
        placeholder={placeholder}
        value={currentValue}
      />
      <Popover
        isOpen={() => !!(isOpen && results.length)}
        style={{
          borderRadius: '0 0 5px 5px',
          padding: '0px 10px',
          boxShadow: 'none',
          border: '2px solid #f1f1f1',
          width: '52.5%',
          maxWidth: '476px',
          marginTop: '-8px',
          fontSize: '14px',
        }}
      >
        <Flex
          style={{
            flexDirection: 'column',
          }}
        >
          {F.mapIndexed(
            (item, index) => (
              <Option
                key={getValue(item)}
                onClick={() => onSelect(getValue(item))}
                style={{
                  borderBottom:
                    index < results.length - 1 ? '2px solid #f1f1f1' : '',
                }}
              >
                {getName(item)}
              </Option>
            ),
            results
          )}
        </Flex>
      </Popover>
    </div>
  )
)
