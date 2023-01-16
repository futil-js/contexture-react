import React from 'react'
import _ from 'lodash/fp.js'
import F from 'futil'
import { observer } from 'mobx-react'
import { Flex } from '../greyVest/index.js'
import { useNode, useTheme } from '../utils/hooks.js'

const customStyles = {
  valueContainer: (styles) => ({
    ...styles,
    ...{
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  }),
}

const elementStyle = {
  flex: 1,
  marginBottom: '5px',
}

const operatorOptions = ['within', 'not within']

export default observer(function Geo({
  tree,
  node,
  path,
  loadOptions,
  GeoCodeLocation = _.noop,
  AutoComplete = null,
  placeholder = 'Address ...',
  theme,
}) {
  node = useNode(node, path, tree)
  theme = useTheme(theme)
  return (
    <theme.Loader loading={node.updating}>
      <Flex style={{ flexFlow: 'column' }}>
        <theme.Select
          style={elementStyle}
          value={node.operator}
          onChange={(e) => tree.mutate(node.path, { operator: e.target.value })}
          options={F.autoLabelOptions(operatorOptions)}
        />
        <div style={elementStyle}>
          <theme.NumberInput
            min="1"
            value={node.radius}
            onChange={(e) => tree.mutate(node.path, { radius: e.target.value })}
            placeholder="Enter number of miles ..."
          />{' '}
          from
        </div>
        <div style={elementStyle}>
          {AutoComplete && (
            <AutoComplete
              cacheOptions
              escapeClearsValue
              defaultInputValue={node.location}
              placeholder={placeholder}
              noOptionsMessage={() => ''}
              menuPortalTarget={document.body}
              menuShouldScrollIntoView={true}
              styles={customStyles}
              loadOptions={loadOptions}
              onInputChange={(newValue) =>
                newValue.replace(/[^a-zA-Z0-9\s]+/g, '')
              }
              onChange={async ({ label, value }) => {
                let { latitude, longitude } =
                  (await GeoCodeLocation(value)) || {}
                if (latitude && longitude) {
                  tree.mutate(node.path, {
                    latitude,
                    longitude,
                    location: label,
                  })
                }
              }}
            />
          )}
          {!AutoComplete && <div>Autocomplete component is required!</div>}
        </div>
      </Flex>
    </theme.Loader>
  )
})
