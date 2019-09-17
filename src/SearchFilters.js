import React from 'react'
import _ from 'lodash/fp'
import PropTypes from 'prop-types'
import F from 'futil-js'
import { observer } from 'mobx-react'
import { Flex, QueryBuilder, FilterAdder, FilterList } from '.'
import { ToggleFiltersButton, TreePauseButton } from './purgatory'
import { LinkButton } from './greyVest'
import { withTheme } from './utils/theme'
import { useSearchLayout } from './SearchLayout'

export let SearchTree = () => {}

let LabelledList = ({ list, Component }) =>
  F.mapIndexed(
    ({ label, ...props }, i) => (
      <React.Fragment key={i}>
        {label && <h3>{label}</h3>}
        <Component {...props} />
      </React.Fragment>
    ),
    list
  )

export let AddableFilterList = props => (
  <>
    <FilterList {...props} />
    <FilterAdder {...props} uniqueFields />
  </>
)

export let FiltersBox = withTheme(({ theme: { Box }, ...props }) => (
  <Box className="filter-list">
    <AddableFilterList {...props} />
  </Box>
))
FiltersBox.displayName = 'FiltersBox'

let BasicSearchFilters = ({ trees, children }) => {
  let layout = useSearchLayout()
  return (
    <div>
      <Flex style={{ alignItems: 'center' }}>
        <h1>Filters</h1>
        <TreePauseButton children={children} />
        <ToggleFiltersButton onClick={F.sets('resultsOnly', layout)} />
      </Flex>
      <LabelledList list={trees} Component={FiltersBox} />
      <LinkButton onClick={F.sets('builder', layout)} style={{ marginTop: 15 }}>
        Switch to Advanced Search Builder
      </LinkButton>
    </div>
  )
}

let BuilderSearchFilters = ({ trees }) => {
  let layout = useSearchLayout()
  return (
    <div>
      <Flex style={{ alignItems: 'center' }}>
        <h1>Filters</h1>
        <LinkButton onClick={F.sets('basic', layout)}>
          Back to Regular Search
        </LinkButton>
      </Flex>
      <LabelledList list={trees} Component={QueryBuilder} />
    </div>
  )
}

let SearchFilters = ({ children }) => {
  let layout = useSearchLayout()
  let trees = _.flow(
    React.Children.toArray,
    _.map('props')
  )(children)
  return F.view(layout) === 'basic' ? (
    <BasicSearchFilters {...{ trees, children }} />
  ) : F.view(layout) === 'builder' ? (
    <BuilderSearchFilters {...{ trees }} />
  ) : null
}

SearchFilters.propTypes = {
  mode: PropTypes.oneOf(['basic', 'builder', 'resultsOnly']),
}

export default observer(SearchFilters)
