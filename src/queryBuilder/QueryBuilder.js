import React from 'react'
import { observable } from 'mobx'
import DDContext from './DragDrop/DDContext'
import { Component } from '../utils/mobx-react-utils'
import Group from './Group'
import styles from '../styles'
import { defaultTheme } from '../utils/hoc'

let { background } = styles

export default DDContext(
  defaultTheme({
    Button: 'button',
  })(
    Component(
      (
        { tree: iTree, types: iTypes, typeComponents: iTypeComponents },
        {
          typeComponents = iTypeComponents,
          types = iTypes || typeComponents,
          tree = iTree,
        }
      ) => ({
        types,
        state: observable({
          adding: false,
          ...tree,
        }),
      }),
      ({
        state,
        path,
        fields,
        types = {},
        theme,
        mapNodeToProps,
      }) => (
        <div style={{ background }}>
          {state.getNode(path) && (
            <Group
              node={state.getNode(path)}
              tree={state}
              isRoot={true}
              {...{
                theme,
                fields,
                types,
                mapNodeToProps,
              }}
            />
          )}
          <theme.Button
            onClick={() => {
              state.adding = !state.adding
            }}
          >
            {state.adding ? 'Cancel' : 'Add Filter'}
          </theme.Button>
        </div>
      ),
      'QueryBuilder'
    )),
    { allowEmptyNode: true } // false alarm, this one's for DDContext
)