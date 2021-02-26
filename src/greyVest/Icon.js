import _ from 'lodash/fp'
import React from 'react'
import { Dynamic } from '../greyVest'
import TextButton from './TextButton'
import { ImFilter } from 'react-icons/im'
import {
  MdAdd,
  MdDone,
  MdRemove,
  MdRefresh,
  MdWarning,
  MdMoreVert,
  MdFiberNew,
  MdAutorenew,
  MdExpandLess,
  MdExpandMore,
  MdUnfoldLess,
  MdUnfoldMore,
  MdFilterList,
  MdChevronLeft,
  MdChevronRight,
  MdKeyboardArrowUp,
  MdKeyboardArrowDown,
} from 'react-icons/md'

let toIcon = Icon => ({ style, ...props }) =>
  _.isString(Icon) ? (
    <i className="material-icons" style={{ fontSize: 20, ...style }} {...props}>
      {Icon}
    </i>
  ) : (
    <Icon
      size="1.5em"
      style={{ verticalAlign: 'middle', ...style }}
      {...props}
    />
  )

let iconMap = {
  SortAscending: toIcon(MdExpandLess),
  SortDescending: toIcon(MdExpandMore),
  MoveLeft: toIcon(MdChevronLeft),
  MoveRight: toIcon(MdChevronRight),
  RemoveColumn: toIcon(MdRemove),
  AddColumn: toIcon(MdAdd),
  FilterExpand: toIcon(ImFilter),
  FilterCollapse: toIcon(MdFilterList),
  FilterAdd: toIcon(MdFilterList),
  TableColumnMenu: () => <TextButton>{toIcon(MdMoreVert)()}</TextButton>,
  FilterListExpand: toIcon(MdKeyboardArrowDown),
  FilterListCollapse: toIcon(MdKeyboardArrowUp),
  TreePause: toIcon(MdUnfoldLess),
  TreeUnpause: toIcon(MdUnfoldMore),
  PreviousPage: toIcon(MdChevronLeft),
  NextPage: toIcon(MdChevronRight),
  Check: toIcon(MdDone),
  Warning: toIcon(MdWarning),
  Previous5Pages: () => <span>...</span>,
  Next5Pages: () => <span>...</span>,
  Refresh: () => (
    <TextButton
      className="animated pulse slow infinite"
      style={{ animationDuration: '500ms' }}
    >
      {toIcon(MdRefresh)()}
    </TextButton>
  ),
  AutoUpdate: toIcon(MdAutorenew),
  New: toIcon(MdFiberNew),
  Expand: toIcon(MdRemove),
}

let Icon = ({ icon, ...props }) => (
  <Dynamic component={iconMap[icon] || toIcon(icon)} {...props} />
)

export default Icon
