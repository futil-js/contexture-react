import F from 'futil-js'
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
  let injectNodeAndLoad = (...args) =>
    _.flow(
      Loading,
      injectTreeNode(...args)
    )

  let Components = {
    Facet: _.flow(
      injectNodeAndLoad(exampleTypes.facet),
      defaultProps({ TextInput, Checkbox, RadioList })
    )(Facet),

    Number: _.flow(
      injectNodeAndLoad(exampleTypes.number),
      defaultProps({ NumberInput, Button })
    )(Number),

    Date: _.flow(
      injectNodeAndLoad(exampleTypes.date),
      defaultProps({ DateInput, RadioList, Select })
    )(Date),

    DateRangePicker: injectNodeAndLoad(exampleTypes.date)(DateRangePicker),

    Query: _.flow(
      injectNodeAndLoad(exampleTypes.query),
      defaultProps({ TextInput })
    )(Query),

    TagsQuery: _.flow(
      injectNodeAndLoad(exampleTypes.tagsQuery),
      defaultProps({ TagsInput, Checkbox, RadioList, Button })
    )(TagsQuery),

    Exists: _.flow(
      injectNodeAndLoad(exampleTypes.exists),
      defaultProps({ RadioList })
    )(Exists),

    Bool: _.flow(
      injectNodeAndLoad(exampleTypes.bool),
      defaultProps({ RadioList })
    )(Bool),

    ResultTable: _.flow(
      injectNodeAndLoad(),
      defaultProps({ Table, Modal, FieldPicker, ListGroupItem, Icon })
    )(ResultTable),

    ResultCount: _.flow(
      injectNodeAndLoad(exampleTypes.results),
      defaultProps({ loaderStyle: { display: 'inline-block' } })
    )(ResultCount),

    ResultPager: _.flow(
      injectNodeAndLoad(),
      defaultProps({ Icon })
    )(ResultPager),

    DateHistogram: injectNodeAndLoad(exampleTypes.dateHistogram)(DateHistogram),

    TermsStats: injectNodeAndLoad(exampleTypes.TermsStats)(TermsStats),

    TermsStatsTable: _.flow(
      injectNodeAndLoad(exampleTypes.TermsStats),
      defaultProps({ Button })
    )(TermsStatsTable),

    Geo: _.flow(
      injectNodeAndLoad(exampleTypes.geo),
      defaultProps({ NumberInput })
    )(Geo),

    Text: _.flow(
      injectNodeAndLoad(),
      defaultProps({ Input })
    )(Text),

    TagsText: _.flow(
      injectNodeAndLoad(),
      defaultProps({ TagsInput, Select })
    )(TagsText),

    CheckableTermsStatsTable: _.flow(
      injectNodeAndLoad(),
      defaultProps({ Button })
    )(CheckableTermsStatsTable),
  }

  Components.CheckableResultTable = _.flow(
    injectNodeAndLoad(),
    defaultProps({ ResultTable: Components.ResultTable, Checkbox })
  )(CheckableResultTable)

  Components = F.mapValuesIndexed(
    (Component, name) => setDisplayName(name)(Component),
    Components
  )

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
