import _ from 'lodash/fp.js'
import F from 'futil'
import React from 'react'
import { useNode } from '../utils/hooks.js'
import FilterButtonList from '../FilterButtonList.js'
import { StepsAccordion, AccordionStep } from '../purgatory/index.js'

let generateStepTitle = (node, title) => (i) =>
  (
    <h1>
      <span className="step-number">Step {i + 1} - </span>
      {i === 0
        ? `Search for ${title || 'Results'} by...`
        : i < _.size(node.children) - 1
        ? `And...`
        : `Narrow Your Results`}
    </h1>
  )

let QueryWizard = ({
  tree,
  node,
  path,
  fields = {},
  title,
  onSubmit = _.noop,
  mapNodeToProps = _.noop,
  style,
}) => {
  node = useNode(node, path, tree)
  return (
    <StepsAccordion {...{ style, onSubmit }}>
      {F.mapIndexed(
        (child, i) => (
          <AccordionStep
            key={i}
            isRequired={i === 0}
            title={generateStepTitle(node, title)}
          >
            <FilterButtonList
              {...{
                node: child,
                tree,
                fields,
                mapNodeToProps,
              }}
              key={node.key}
            />
          </AccordionStep>
        ),
        _.get('children', node)
      )}
    </StepsAccordion>
  )
}

export default QueryWizard
