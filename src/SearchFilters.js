import React from 'react'
import _ from 'lodash/fp'
import PropTypes from 'prop-types'
import F from 'futil-js'
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

let BasicSearchFilters = ({ trees, children, BasicFilters }) => {
  let layout = useSearchLayout()
  return (
    <div>
      <Flex alignItems="center" justifyContent="space-between">
        <Flex alignItems="center">
          <h1>Filters</h1>
          <ToggleFiltersButton onClick={F.sets('resultsOnly', layout)} />
        </Flex>
        <div>
          <TreePauseButton children={children} />
        </div>
      </Flex>
      <LabelledList list={trees} Component={BasicFilters} />
      <LinkButton onClick={F.sets('builder', layout)} style={{ marginTop: 15 }}>
        Switch to Advanced Search Builder
      </LinkButton>
    </div>
  )
}

let BuilderSearchFilters = ({ trees, BuilderFilters }) => {
  let layout = useSearchLayout()
  return (
    <div>
      <Flex style={{ alignItems: 'center' }}>
        <h1>Filters</h1>
        <LinkButton onClick={F.sets('basic', layout)}>
          Back to Regular Search
        </LinkButton>
      </Flex>
      <LabelledList list={trees} Component={BuilderFilters} />
    </div>
  )
}

let SearchFilters = ({
  children,
  BasicFilters = FiltersBox,
  BuilderFilters = QueryBuilder,
}) => {
  let layout = useSearchLayout()
  let trees = _.flow(
    React.Children.toArray,
    _.map('props')
  )(children)
  return F.view(layout) === 'basic' ? (
    <BasicSearchFilters {...{ trees, children, BasicFilters }} />
  ) : F.view(layout) === 'builder' ? (
    <BuilderSearchFilters {...{ trees, BuilderFilters }} />
  ) : null
}

SearchFilters.propTypes = {
  mode: PropTypes.oneOf(['basic', 'builder', 'resultsOnly']),
}

export default SearchFilters
