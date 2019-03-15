import _ from 'lodash/fp'
import { exampleTypes } from 'contexture-client'
import Facet from './Facet'
import Number from './Number'
import Date from './Date'
import DateRangePicker from './DateRangePicker'
import Query from './Query'
import Geo from './Geo'
import TagsQuery from './TagsQuery'
import TagsText from './TagsText'
import Exists from './Exists'
import Bool from './Bool'
import ResultCount from './ResultCount'
import ResultTable from './ResultTable'
import CheckableResultTable from './CheckableResultTable'
import ResultPager from './ResultPager'
import DateHistogram from './DateHistogram'
import TermsStats from './TermsStats'
import TermsStatsTable from './TermsStatsTable'
import CheckableTermsStatsTable from './CheckableTermsStatsTable'
import Text from './Text'
import { defaultProps, setDisplayName } from 'recompose'
import ModalDefault from '../layout/Modal'
import DefaultSelect from '../layout/Select'
import WrappedDateInput from '../layout/WrappedDateInput'
import injectTreeNode from '../utils/injectTreeNode'
import StripedLoader from '../utils/StripedLoader'
import { injectDefaults } from '../utils/mobx-react-utils'

let wrapLoading = Loading =>
  _.flow(
    Loading,
    injectDefaults(({ node }) => ({ isLoading: node && node.updating }))
  )

export default ({
  Input = 'input',
  Button = 'button',
  TextInput = Input,
  NumberInput = defaultProps({ type: 'number' })(Input),
  DateInput = WrappedDateInput,
  Checkbox = defaultProps({ type: 'checkbox' })('input'),
  RadioList,
  TagsInput,
  Table = 'table',
  Modal = ModalDefault,
  FieldPicker,
  ListGroupItem = 'div',
  Icon,
  Select = DefaultSelect,
  Loading = StripedLoader,
} = {}) => {
  let Components = {
    Facet: _.flow(
      wrapLoading(Loading()),
      defaultProps({ TextInput, Checkbox, RadioList }),
      injectTreeNode(exampleTypes.facet),
      setDisplayName('Facet')
    )(Facet),

    Number: _.flow(
      wrapLoading(Loading()),
      defaultProps({ NumberInput, Button }),
      injectTreeNode(exampleTypes.number),
      setDisplayName('Number')
    )(Number),

    Date: _.flow(
      wrapLoading(Loading()),
      defaultProps({ DateInput, RadioList, Select }),
      injectTreeNode(exampleTypes.date),
      setDisplayName('Date')
    )(Date),

    DateRangePicker: _.flow(
      wrapLoading(Loading()),
      injectTreeNode(exampleTypes.date),
      setDisplayName('DateRangePicker')
    )(DateRangePicker),

    Query: _.flow(
      wrapLoading(Loading()),
      defaultProps({ TextInput }),
      injectTreeNode(exampleTypes.query),
      setDisplayName('Query')
    )(Query),

    TagsQuery: _.flow(
      wrapLoading(Loading()),
      defaultProps({ TagsInput, Checkbox, RadioList, Button }),
      injectTreeNode(exampleTypes.tagsQuery),
      setDisplayName('TagsQuery')
    )(TagsQuery),

    Exists: _.flow(
      wrapLoading(Loading()),
      defaultProps({ RadioList }),
      injectTreeNode(exampleTypes.exists),
      setDisplayName('Exists')
    )(Exists),

    Bool: _.flow(
      wrapLoading(Loading()),
      defaultProps({ RadioList }),
      injectTreeNode(exampleTypes.bool),
      setDisplayName('Bool')
    )(Bool),

    ResultTable: _.flow(
      wrapLoading(Loading()),
      defaultProps({ Table, Modal, FieldPicker, ListGroupItem, Icon }),
      injectTreeNode(),
      setDisplayName('ResultTable')
    )(ResultTable),

    ResultCount: _.flow(
      wrapLoading(Loading({ display: 'inline-block' })),
      injectTreeNode(exampleTypes.results),
      setDisplayName('ResultCount')
    )(ResultCount),

    ResultPager: _.flow(
      wrapLoading(Loading()),
      defaultProps({ Icon }),
      injectTreeNode(),
      setDisplayName('ResultPager')
    )(ResultPager),

    DateHistogram: _.flow(
      wrapLoading(Loading()),
      injectTreeNode(exampleTypes.dateHistogram),
      setDisplayName('DateHistogram')
    )(DateHistogram),

    TermsStats: _.flow(
      wrapLoading(Loading()),
      injectTreeNode(exampleTypes.TermsStats),
      setDisplayName('TermsStats')
    )(TermsStats),

    TermsStatsTable: _.flow(
      wrapLoading(Loading()),
      defaultProps({ Button }),
      injectTreeNode(exampleTypes.TermsStats),
      setDisplayName('TermsStatsTable')
    )(TermsStatsTable),

    Geo: _.flow(
      wrapLoading(Loading()),
      defaultProps({ NumberInput }),
      injectTreeNode(exampleTypes.geo),
      setDisplayName('Geo')
    )(Geo),

    Text: _.flow(
      wrapLoading(Loading()),
      defaultProps({ Input }),
      injectTreeNode(),
      setDisplayName('Text')
    )(Text),

    TagsText: _.flow(
      wrapLoading(Loading()),
      defaultProps({ TagsInput, Select }),
      injectTreeNode(),
      setDisplayName('TagsText')
    )(TagsText),

    CheckableTermsStatsTable: _.flow(
      wrapLoading(Loading()),
      defaultProps({ Button }),
      injectTreeNode(),
      setDisplayName('CheckableTermsStatsTable')
    )(CheckableTermsStatsTable),
  }

  Components.CheckableResultTable = _.flow(
    wrapLoading(Loading()),
    defaultProps({ ResultTable: Components.ResultTable, Checkbox }),
    injectTreeNode(),
    setDisplayName('CheckableResultTable')
  )(CheckableResultTable)

  let TypeMap = {
    facet: Components.Facet,
    query: Components.Query,
    number: Components.Number,
    date: Components.Date,
    tagsQuery: Components.TagsQuery,
    tagsText: Components.TagsText,
    geo: Components.Geo,
    text: Components.Text,
    mongoId: Components.Text,
    exists: Components.Exists,
    bool: Components.Bool,
  }
  return { ...Components, TypeMap }
}
