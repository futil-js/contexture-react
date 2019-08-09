import React from 'react'
import F from 'futil-js'
import _ from 'lodash/fp'
import { observer } from 'mobx-react'
import { defaultProps } from 'recompose'
import { useLens } from '../../utils/react'
import { withNode } from '../../utils/hoc'
import { withTheme } from '../../utils/theme'
import {
  Flex,
  TextHighlight,
  NestedPicker,
  ModalFilterAdder,
  Tag,
  TagsInput as BaseTagsInput,
  FilterList as BaseFilterList,
  FilterButtonList as BaseFilterButtonList,
  Dynamic,
} from '../../'
import ExampleTypeConstructor from '../../exampleTypes/'
import QueryBuilderComponent from '../../queryBuilder'
import QueryWizardComponent from '../../queryWizard'
import {
  Modal as DefaultModal,
  CheckButton as DefaultCheckButton,
  StepsAccordion as DefaultStepsAccordion,
  AccordionStep,
  Popover as DefaultPopover,
} from '../../layout'

export { default as GVStyle } from './style'

import Input from './Input'
import Checkbox from './Checkbox'
import Textarea from './Textarea'
import Select from './Select'
import CheckboxList from './CheckboxList'
import RadioList from './RadioList'
import Fonts from './Fonts'
import IconButton from './IconButton'
import Table from './Table'
import Button from './Button'
import ButtonRadio from './ButtonRadio'
import TabList from './TabList'
export { Tabs, Tab, TabContent, TabLabel } from './Tabs'
import ErrorList from './ErrorList'
import ErrorText from './ErrorText'
import Box from './Box'
import LinkButton from './LinkButton'
import TreePauseButton from './TreePauseButton'
import ToggleFiltersButton from './ToggleFiltersButton'
import ToggleFiltersHeader from './ToggleFiltersHeader'
export { default as SearchLayout } from './SearchLayout'
import BaseSearchFilters from './SearchFilters'
import DateInput from './DateInput'

export {
  Input,
  Checkbox,
  Textarea,
  Select,
  CheckboxList,
  RadioList,
  Fonts,
  IconButton,
  Table,
  Button,
  ButtonRadio,
  TabList,
  ErrorList,
  Box,
  LinkButton,
  TreePauseButton,
  ToggleFiltersButton,
  ToggleFiltersHeader,
  AccordionStep,
}

export let SearchTree = () => {}

// Lifted from demo theme to prevent codependency
export let Highlight = ({ style = {}, ...props }) => (
  <TextHighlight
    Wrap={x => <b style={{ backgroundColor: 'yellow', ...style }} {...x} />}
    {...props}
  />
)

export let ListItem = observer(({ style = {}, ...props }) => {
  let hovering = useLens(false)
  return (
    <div
      style={{
        cursor: 'pointer',
        padding: '2.5px 5px',
        whiteSpace: 'nowrap',
        fontSize: 13,
        color: 'initial',
        ...(F.view(hovering) && { color: '#0076de' }),
        ...style,
      }}
      {...F.domLens.hover(hovering)}
      {...props}
    />
  )
})
ListItem.displayName = 'ListItem'

export let ListGroupItem = props => (
  <ListItem
    style={{
      display: 'grid',
      gridGap: '5px',
      gridTemplateColumns: '20px 1fr',
      alignItems: 'center',
    }}
    {...props}
  />
)

let SmallIcon = ({ icon }) => (
  <i className="material-icons" style={{ fontSize: 20 }}>
    {icon}
  </i>
)
let iconMap = {
  SortAscending: () => <SmallIcon icon="expand_less" />,
  SortDescending: () => <SmallIcon icon="expand_more" />,
  MoveLeft: () => <SmallIcon icon="chevron_left" />,
  MoveRight: () => <SmallIcon icon="chevron_right" />,
  RemoveColumn: () => <SmallIcon icon="remove" />,
  AddColumn: () => <SmallIcon icon="add" />,
  FilterExpand: () => <SmallIcon icon="filter_list" />,
  FilterCollapse: () => <SmallIcon icon="filter_list" />,
  FilterAdd: () => <SmallIcon icon="filter_list" />,
  TableColumnMenu: () => (
    <IconButton>
      <SmallIcon icon="more_vert" />
    </IconButton>
  ),
  FilterListExpand: () => <SmallIcon icon="add" />,
  FilterListCollapse: () => <SmallIcon icon="remove" />,
  PreviousPage: () => <SmallIcon icon="chevron_left" />,
  NextPage: () => <SmallIcon icon="chevron_right" />,
  Previous5Pages: () => <span>...</span>,
  Next5Pages: () => <span>...</span>,
  Refresh: () => (
    <IconButton
      className="animated pulse slow infinite"
      style={{ animationDuration: '500ms' }}
    >
      <SmallIcon icon="refresh" />
    </IconButton>
  ),
}
let Icon = ({ icon, ...props }) => (
  <Dynamic component={iconMap[icon]} {...props} />
)

let AddLabel = (
  <Flex style={{ justifyContent: 'space-between', alignItems: 'center' }}>
    Add Custom Filter
    <i className="material-icons" style={{ opacity: 0.4 }}>
      filter_list
    </i>
  </Flex>
)

let FilterListItem = observer(
  ({ active, disabled, hasChildren, children, ...props }) => (
    <div
      style={{
        padding: '10px 40px',
        cursor: 'pointer',
        fontSize: 18,
        background: active ? '#ebebeb' : '#fff',
        color: disabled ? '#9b9b9b' : '#000',
      }}
      {...props}
    >
      {hasChildren ? (
        <Flex style={{ alignItems: 'center' }}>
          {children}
          <i className="material-icons" style={{ fontSize: 20 }}>
            chevron_right
          </i>
        </Flex>
      ) : (
        children
      )}
    </div>
  )
)
FilterListItem.displayName = 'FilterListItem'

let gvTheme = {
  Button,
  Input,
  Highlight,
  Item: FilterListItem,
  label: AddLabel,
  Checkbox,
  RadioList,
  Table,
  FieldPicker,
  ListGroupItem,
  TagsInput,
  Icon,
  DateInput,
  ButtonGroup,
  ListItem,
  MissingTypeComponent,
  Picker: FieldPicker,
  Modal: DefaultModal,
  Popover: DefaultPopover,
  CheckButton,
  AccordionStep,
}

let defaultGvTheme = withTheme(gvTheme)

export let Adder = defaultGvTheme(ModalFilterAdder)

let CheckButtonButton = props => (
  <Button className="gv-checkbutton" {...props} />
)
export let CheckButton = withTheme({
  ...gvTheme,
  Button: CheckButtonButton,
})(DefaultCheckButton)

export let Modal = defaultProps({ className: 'gv-body' })(DefaultModal)
Modal.displayName = 'Modal'

export let ButtonGroup = defaultProps({ className: 'gv-button-group' })(Flex)
ButtonGroup.displayName = 'ButtonGroup'

export let PagerItem = observer(({ active, disabled, ...x }) => (
  <span
    className={`gv-pager-item ${disabled ? 'disabled' : ''} ${
      active ? 'active' : ''
    }`}
    {...x}
  />
))
PagerItem.displayName = 'PagerItem'

let TagComponent = withTheme({
  RemoveIcon: props => (
    <span className="tags-input-tag-remove fa fa-times" {...props} />
  ),
})(Tag)
export let TagsInput = withTheme({ ...gvTheme, TagComponent })(BaseTagsInput)

let FieldPicker = defaultGvTheme(NestedPicker)

export let ExampleTypes = ExampleTypeConstructor(gvTheme)
export let Pager = props => (
  <ExampleTypes.ResultPager
    theme={{ ...gvTheme, Item: PagerItem }}
    {...props}
    className="gv-pager gv-box"
  />
)

export let PagedResultTable = ({ tree, node, path, ...props }) => (
  <>
    <ExampleTypes.ResultTable {...{ tree, node, path, ...props }} />
    <Flex style={{ justifyContent: 'space-around', padding: '10px' }}>
      <Pager {...{ tree, node, path }} />
    </Flex>
  </>
)
PagedResultTable.displayName = 'PagedResultTable'

export let MissingTypeComponent = withNode(({ node = {} }) => (
  // Min Height here is to align better in QueryBuilder
  <Flex style={{ minHeight: '40px', alignItems: 'center' }}>
    <ErrorText>
      Type <b>{node.type}</b> is not supported (for key <i>{node.key}</i>)
    </ErrorText>
  </Flex>
))

export let FilterList = defaultGvTheme(BaseFilterList)

export let AddableFilterList = props => (
  <>
    <FilterList {...props} />
    <Adder {...props} uniqueFields />
  </>
)

export let FiltersBox = props => (
  <div className="gv-box filter-list">
    <AddableFilterList {...props} />
  </div>
)

export let QueryBuilder = defaultGvTheme(QueryBuilderComponent)

export let SearchFilters = withTheme({
  ...gvTheme,
  QueryBuilder,
  FiltersBox,
})(BaseSearchFilters)

export let FilterButtonList = _.flow(
  defaultProps({ className: 'gv-filter-button-list' }),
  defaultGvTheme
)(BaseFilterButtonList)

export let StepsAccordion = _.flow(
  defaultProps({ className: 'gv-steps-accordion' }),
  defaultGvTheme
)(DefaultStepsAccordion)

export let QueryWizard = withTheme({
  ...gvTheme,
  StepsAccordion,
  FilterButtonList,
})(QueryWizardComponent)
