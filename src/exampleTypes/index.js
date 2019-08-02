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
import { defaultProps } from 'recompose'
import ModalDefault from '../layout/Modal'
import DefaultSelect from '../layout/Select'
import WrappedDateInput from '../layout/WrappedDateInput'
import { defaultTheme } from '../utils/hoc'

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
  ButtonGroup,
} = {}) => {
  let Components = {
    Facet: defaultTheme({
      TextInput,
      Button,
      Checkbox,
      RadioList,
      ButtonGroup,
    })(Facet),
    Number: defaultTheme({ NumberInput, Button })(Number),
    Date: defaultTheme({ DateInput, RadioList, Select })(Date),
    DateRangePicker,
    Query: defaultTheme({ TextInput })(Query),
    TagsQuery: defaultTheme({ TagsInput, Checkbox, RadioList, Button })(
      TagsQuery
    ),
    Exists: defaultTheme({ RadioList })(Exists),
    Bool: defaultTheme({ RadioList })(Bool),
    ResultTable: defaultProps({
      theme: {
        Table,
        Modal,
        FieldPicker,
        ListGroupItem,
        Icon,
      }
    })(ResultTable),
    ResultCount,
    ResultPager: defaultTheme({ Icon })(ResultPager),
    DateHistogram,
    TermsStats,
    TermsStatsTable: defaultTheme({ Button })(TermsStatsTable),
    CheckableTermsStatsTable: defaultTheme({ Button })(
      CheckableTermsStatsTable
    ),
    Geo: defaultTheme({ NumberInput })(Geo),
    Text: defaultTheme({ Input })(Text),
    TagsText: defaultTheme({ TagsInput, Select })(TagsText),
  }
  Components.CheckableResultTable = defaultTheme({
    ResultTable: Components.ResultTable,
    Checkbox,
  })(CheckableResultTable)
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
