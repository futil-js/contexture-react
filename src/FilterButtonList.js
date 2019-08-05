import F from 'futil-js'
import _ from 'lodash/fp'
import React from 'react'
import { Dynamic, Flex, CheckButton, Modal } from './layout'
import DefaultMissingTypeComponent from './DefaultMissingTypeComponent'
import { defaultTheme, withNode, withLoader } from './utils/hoc'
import styles from './styles'

let FilterButtonItem = _.flow(
  withLoader,
  defaultTheme({
    Button: 'button',
    CheckButton,
    Modal,
    MissingTypeComponent: DefaultMissingTypeComponent,
  })
)(({ node, tree, fields, mapNodeToProps, theme }) => {
  let mappedProps = mapNodeToProps(node, fields)
  let modal = F.stateLens(React.useState(false))
  let title = // we really need a title, so here's every possible fallback
    _.get('label', mappedProps) ||
    _.get([node.field, 'label'], fields) ||
    node.field ||
    node.key
  let description = _.get('description', mappedProps)
  return (
    <>
      <theme.CheckButton checked={node.hasValue} onClick={F.on(modal)}>
        {title}
      </theme.CheckButton>
      <theme.Modal isOpen={modal}>
        <div className="filter-button-modal">
          <h1>{title}</h1>
          {description && (
            <div className="filter-description">{description}</div>
          )}
          <div className="filter-component">
            <Dynamic
              theme={theme}
              Component={theme.MissingTypeComponent}
              tree={tree}
              node={node}
              path={_.toArray(node.path)}
              {...mappedProps}
            />
          </div>
          <theme.Button onClick={() => tree.clear(node.path)}>
            Clear
          </theme.Button>
          <theme.Button primary onClick={F.off(modal)}>
            Done
          </theme.Button>
        </div>
      </theme.Modal>
    </>
  )
})

let GroupBox = ({ nodeJoinColor, children, nested, className }) => (
  <Flex
    wrap
    className={`${className} ${nested ? 'nested' : ''}`}
    alignItems="center"
    style={{ borderColor: nodeJoinColor }}
  >
    {children}
  </Flex>
)

let FilterButtonList = withNode(
  ({
    node,
    tree,
    fields = {},
    mapNodeToProps = _.noop,
    className = 'filter-button-list',
    theme,
    nested = false,
  }) => (
    <GroupBox
      {...{ nested, className }}
      nodeJoinColor={node && styles.joinColor(node)}
    >
      {_.map(child => {
        let Component = child.children ? FilterButtonList : FilterButtonItem
        return (
          <Component
            key={child.path}
            nested
            {...{
              tree,
              node: child,
              fields,
              mapNodeToProps,
              theme,
              className,
            }}
          />
        )
      }, _.get('children', node))}
    </GroupBox>
  )
)

FilterButtonList.displayName = 'FilterButtonList'
export default FilterButtonList
