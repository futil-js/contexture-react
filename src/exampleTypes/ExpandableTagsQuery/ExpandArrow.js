import React from 'react'
import F from 'futil'
import { observer } from 'mobx-react'
import { Flex } from '../../greyVest/index.js'
import { useTheme } from '../../utils/hooks.js'
import { tagTerm } from '../TagsQuery/utils.js'

export default observer(function ExpandArrow({
  collapse,
  tagsLength,
  style,
  theme,
}) {
  theme = useTheme(theme)
  return (
    !!(F.view(collapse) && tagsLength) && (
      <div className="expand-arrow" onClick={F.off(collapse)} style={style}>
        <div
          style={{
            height: 0,
            cursor: 'pointer',
            textAlign: 'center',
          }}
          title="Expand to see all tags"
        >
          <Flex
            style={{
              display: 'inline-flex',
              backgroundColor: 'white',
              borderRadius: 4,
              padding: '5px 12px',
              boxShadow: '0 1px 4px 0 rgba(39, 44, 65, 0.1)',
              color: '#9b9b9b',
              fontWeight: 400,
            }}
            alignItems="center"
            justifyContent="center"
          >
            View all {tagsLength} {tagTerm}s
            <theme.Icon icon="Expand" style={{ fontSize: 16, marginLeft: 6 }} />
          </Flex>
        </div>
      </div>
    )
  )
})
