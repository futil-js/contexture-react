import _ from 'lodash/fp.js'
import React from 'react'
import GVPagerItem from './PagerItem.js'
import Flex from './Flex.js'
import { useTheme } from '../utils/hooks.js'

export default function Pager({
  value,
  onChange = () => {},
  pageCount,
  PagerItem = GVPagerItem,
  disabled = false,
  theme,
}) {
  theme = useTheme(theme)
  return (
    pageCount > 1 && (
      <Flex justifyContent="center" alignItems="center">
        <PagerItem
          disabled={disabled || !(value > 1)}
          onClick={() => onChange(value - 1)}
        >
          <theme.Icon icon="PreviousPage" />
        </PagerItem>
        {value > 3 && (
          <PagerItem
            disabled={disabled}
            onClick={() => onChange(_.max([0, value - 5]))}
          >
            <theme.Icon icon="Previous5Pages" />
          </PagerItem>
        )}
        {_.reverse(
          _.times(
            (n) =>
              value > n + 1 && (
                <PagerItem
                  disabled={disabled}
                  key={`prev${n}`}
                  onClick={() => onChange(value - (n + 1))}
                >
                  {value - (n + 1)}
                </PagerItem>
              ),
            2
          )
        )}
        <PagerItem disabled={disabled} active>
          {value}
        </PagerItem>
        {_.times(
          (n) =>
            value + (n + 1) <= pageCount && (
              <PagerItem
                disabled={disabled}
                key={`next${n}`}
                onClick={() => onChange(value + (n + 1))}
              >
                {value + (n + 1)}
              </PagerItem>
            ),
          2
        )}
        {value + 2 < pageCount && (
          <PagerItem
            disabled={disabled}
            onClick={() => onChange(_.min([pageCount, value + 5]))}
          >
            <theme.Icon icon="Next5Pages" />
          </PagerItem>
        )}
        <PagerItem
          disabled={disabled || !(value < pageCount)}
          onClick={() => onChange(value + 1)}
        >
          <theme.Icon icon="NextPage" />
        </PagerItem>
      </Flex>
    )
  )
}
