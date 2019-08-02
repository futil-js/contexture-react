import React from 'react'
import _ from 'lodash/fp'
import { round } from 'lodash'
import { Flex } from '../layout/Flex'
import { contexturify } from '../utils/hoc'

let NumberComponent = contexturify(
  ({
    tree,
    node,
    theme,
    showBestRange = false,
    formatter = _.identity,
    significantDigits,
  }) => (
    <div className="contexture-number">
      <Flex style={{ alignItems: 'center' }}>
        <theme.NumberInput
          value={formatter(node.min) || ''}
          onChange={e =>
            tree.mutate(node.path, {
              min: _.isNumber(significantDigits)
                ? round(e.target.value, significantDigits)
                : e.target.value,
            })
          }
        />
        <div className="contexture-number-separator">-</div>
        <theme.NumberInput
          value={formatter(node.max) || ''}
          onChange={e =>
            tree.mutate(node.path, {
              max: _.isNumber(significantDigits)
                ? round(e.target.value, significantDigits)
                : e.target.value,
            })
          }
        />
      </Flex>
      {showBestRange && (
        <div className="contexture-number-best-range">
          <theme.Button
            style={{ width: '100%' }}
            onClick={async () => {
              // Calculate best range
              await tree.mutate(node.path, { findBestRange: true })
              let { min, max } = _.get('context.bestRange', node)
              if (_.isNumber(significantDigits)) {
                min = round(min, significantDigits)
                max = round(max, significantDigits)
              }
              // Disable best range so the calculation isn't run anymore
              tree.mutate(node.path, {
                findBestRange: false,
                min,
                max,
              })
            }}
          >
            Find best range
          </theme.Button>
        </div>
      )}
    </div>
  )
)
NumberComponent.displayName = 'Number'

export default NumberComponent
