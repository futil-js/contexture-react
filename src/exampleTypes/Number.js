import React from 'react'
import _ from 'lodash/fp.js'
import l from 'lodash'
import { Flex } from '../greyVest/index.js'
import { observer } from 'mobx-react'
import { useNode, useTheme } from '../utils/hooks.js'

let NumberComponent = ({
  tree,
  node,
  showBestRange = false,
  formatter = _.identity,
  significantDigits,
  path,
  theme,
}) => {
  node = useNode(node, path, tree)
  let { Loader, NumberInput, Button } = useTheme(theme)
  return (
    <Loader node={node}>
      <div className="contexture-number" data-path={node.path}>
        <Flex style={{ alignItems: 'center' }}>
          <NumberInput
            value={formatter(node.min) || ''}
            onChange={(e) =>
              tree.mutate(node.path, {
                min: _.isNumber(significantDigits)
                  ? _.toString(l.round(e.target.value, significantDigits))
                  : e.target.value,
              })
            }
          />
          <div className="contexture-number-separator">-</div>
          <NumberInput
            value={formatter(node.max) || ''}
            onChange={(e) =>
              tree.mutate(node.path, {
                max: _.isNumber(significantDigits)
                  ? _.toString(l.round(e.target.value, significantDigits))
                  : e.target.value,
              })
            }
          />
        </Flex>
        {showBestRange && (
          <div className="contexture-number-best-range">
            <Button
              style={{ width: '100%' }}
              onClick={async () => {
                // Calculate best range
                await tree.mutate(node.path, { findBestRange: true })
                let { min, max } = _.get('context.bestRange', node)
                if (_.isNumber(significantDigits)) {
                  min = l.round(min, significantDigits)
                  max = l.round(max, significantDigits)
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
            </Button>
          </div>
        )}
      </div>
    </Loader>
  )
}

export default observer(NumberComponent)
