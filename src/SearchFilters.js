import React from 'react'
import _ from 'lodash/fp'
import PropTypes from 'prop-types'
import F from 'futil'
import { observer } from 'mobx-react'
import { QueryBuilder, FilterAdder, FilterList } from '.'
import { ToggleFiltersButton, TreePauseButton } from './purgatory'
import { Flex, LinkText } from 'grey-vest'
import { withTheme } from './utils/theme'

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
    <FilterAdder
      secondary
      style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
      {...props}
      uniqueFields={!props.allowDuplicateFields}
    />
  </>
)

export let FiltersBox = withTheme(({ theme: { Box }, ...props }) => (
  <Box padding={0}>
    <AddableFilterList {...props} />
  </Box>
))
FiltersBox.displayName = 'FiltersBox'

let BasicSearchFilters = withTheme(
  ({ setMode, trees, children, BasicFilters, theme: { Title } }) => (
    <div>
      <Flex alignItems="center" justifyContent="space-between">
        <Flex alignItems="center">
          <ToggleFiltersButton onClick={() => setMode('resultsOnly')} />
          <Title>Filters</Title>
        </Flex>
        <div>
          <TreePauseButton children={children} />
        </div>
      </Flex>
      <LabelledList list={trees} Component={BasicFilters} />
      <LinkText
        as="button"
        onClick={() => setMode('builder')}
        style={{ marginTop: 16 }}
      >
        Switch to Advanced Search Builder
      </LinkText>
    </div>
  )
)
BasicSearchFilters.displayName = 'BasicSearchFilters'

let BuilderSearchFilters = withTheme(
  ({ setMode, trees, BuilderFilters, theme: { Title } }) => (
    <div>
      <Flex style={{ alignItems: 'center' }}>
        <Title>Filters</Title>
        <LinkText as="button" onClick={() => setMode('basic')}>
          Back to Regular Search
        </LinkText>
      </Flex>
      <LabelledList list={trees} Component={BuilderFilters} />
    </div>
  )
)
BuilderSearchFilters.displayName = 'BuilderSearchFilters'

let SearchFilters = ({
  mode,
  setMode,
  children, // pass allowDuplicateFields in children to override uniqueFields
  BasicFilters = FiltersBox,
  BuilderFilters = QueryBuilder,
}) => {
  let trees = _.flow(
    React.Children.toArray,
    _.map('props')
  )(children)
  return mode === 'basic' ? (
    <BasicSearchFilters {...{ trees, setMode, children, BasicFilters }} />
  ) : mode === 'builder' ? (
    <BuilderSearchFilters {...{ trees, setMode, BuilderFilters }} />
  ) : null
}

SearchFilters.propTypes = {
  mode: PropTypes.oneOf(['basic', 'builder', 'resultsOnly']),
}

export default observer(SearchFilters)
