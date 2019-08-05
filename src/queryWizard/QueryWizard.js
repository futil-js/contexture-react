import _ from 'lodash/fp'
import F from 'futil-js'
import React from 'react'
import DefaultFilterButtonList from '../FilterButtonList'
import { StepsAccordion, AccordionStep } from '../layout'
import { defaultTheme, withNode } from '../utils/hoc'

let generateStepTitle = (node, title) => i => (
  <h1>
    <span className="step-number">Step {i + 1} - </span>
    {i === 0
      ? `Search for ${title || 'Results'} by...`
      : i < _.size(node.children) - 1
      ? `And...`
      : `Narrow Your Results`}
  </h1>
)

let QueryWizard = _.flow(
  withNode,
  defaultTheme({
    StepsAccordion,
    AccordionStep,
    FilterButtonList: DefaultFilterButtonList,
  })
)(
  ({
    theme,
    tree,
    node,
    fields = {},
    title,
    onSubmit = _.noop,
    mapNodeToProps = _.noop,
    style,
  }) => (
    <theme.StepsAccordion {...{ theme, style, onSubmit }}>
      {F.mapIndexed(
        (child, i) => (
          <theme.AccordionStep
            key={i}
            isRequired={i === 0}
            title={generateStepTitle(node, title)}
          >
            <theme.FilterButtonList
              {...{
                theme,
                node: child,
                tree,
                fields,
                mapNodeToProps,
              }}
              key={node.key}
            />
          </theme.AccordionStep>
        ),
        _.get('children', node)
      )}
    </theme.StepsAccordion>
  )
)

QueryWizard.displayName = 'QueryWizard'
export default QueryWizard
