import { Icon as GVIcon, IconButton } from 'grey-vest'
import React from 'react'
import F from 'futil'

let iconMap = {
  SortAscending: 'expand_less',
  SortDescending: 'expand_more',
  MoveLeft: 'chevron_left',
  MoveRight: 'chevron_right',
  RemoveColumn: 'remove',
  AddColumn: 'add',
  FilterExpand: 'filter_list',
  FilterCollapse: 'filter_list',
  FilterAdd: 'filter_list',
  FilterListExpand: 'keyboard_arrow_down',
  FilterListCollapse: 'keyboard_arrow_up',
  TableColumnMenu: "more_vert" ,
  TreePause: 'unfold_less',
  TreeUnpause: 'unfold_more',
  PreviousPage: 'chevron_left',
  NextPage: 'chevron_right',
  Previous5Pages: () => '...',
  Next5Pages: () => '...',
  Refresh: () => (
    <IconButton
      className="animated pulse slow infinite"
      style={{ animationDuration: '500ms' }}
      icon="refresh"
    />
  ),
  AutoUpdate: 'autorenew',
  New: 'fiber_new',
  Expand: 'keyboard_arrow_down',
}

let Icon = ({ icon, ...props }) => (
  <GVIcon icon={F.alias(icon, iconMap)} {...props} />
)

export default Icon
