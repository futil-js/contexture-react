import React from 'react'
import F from 'futil'
import _ from 'lodash/fp.js'
import { observer, Observer } from 'mobx-react'
import { observable } from '../utils/mobx.js'
import { useTheme } from '../utils/hooks.js'
import pluralize from 'pluralize'
import Flex from './Flex.js'
import { isField } from '../utils/fields.js'

let PickerContext = React.createContext()

// Unflatten by with support for arrays (allow dots in paths) and not needing a _.keyBy first
let unflattenObjectBy = _.curry((iteratee, x) =>
  _.zipObjectDeep(F.mapIndexed(iteratee, x), _.values(x))
)

// current implementation is that if a non-field name contains a space, it does not require auto-formatting for display purposes
let getNonFieldItemLabel = F.unless(_.includes(' '), _.startCase)
let getItemLabel = (item) =>
  isField(item)
    ? F.cascade(['shortLabel', 'label'], item)
    : getNonFieldItemLabel(item._key)

let toNested = _.flow(
  _.map((x) => _.defaults({ path: x.value }, x)),
  (fields) => [
    ..._.map(
      (field) => ({
        ...field,
        // flatten path of fields for this group after "CommonlyUsedFields"
        path: `CommonlyUsedFields.${_.camelCase(field.path)}`,
      }),
      _.filter('isCommonlyUsed', fields)
    ),
    ...fields,
  ],
  unflattenObjectBy('path')
)

let FilteredSection = observer(function FilteredSection({
  options,
  highlight,
  style = { maxHeight: 340, overflowY: 'scroll' },
  checked,
}) {
  let { PickerItem, TextHighlight, setHoverItem } =
    React.useContext(PickerContext)
  return (
    <div style={style}>
      {F.mapIndexed(
        (option, field) => (
          <PickerItem
            key={field}
            isChecked={checked.has(option.value)}
            onClick={() => {
              checked.has(option.value)
                ? checked.delete(option.value)
                : checked.set(option.value, option)
            }}
            {...F.domLens.hover((isHover) =>
              setHoverItem(isHover ? option : null)
            )}
          >
            <TextHighlight text={option.label} pattern={highlight} />
          </PickerItem>
        ),
        options
      )}
    </div>
  )
})

let Section = observer(function Section({
  options,
  onClick,
  selected,
  checked,
  style = { overflow: 'auto', width: '100%', maxHeight: 300 },
}) {
  let { PickerItem, setHoverItem } = React.useContext(PickerContext)
  return (
    <div style={style}>
      {_.map(
        (item) => (
          <PickerItem
            key={item._key}
            onClick={() =>
              onClick((_.isString(item.value) && item.value) || item._key, item)
            }
            active={selected === item._key}
            hasChildren={!isField(item)}
            isChecked={checked.has(item.value)}
            {...F.domLens.hover((isHover) =>
              setHoverItem(isHover ? item : null)
            )}
          >
            {getItemLabel(item)}
          </PickerItem>
        ),
        _.flow(F.unkeyBy('_key'), _.sortBy(getItemLabel))(options)
      )}
    </div>
  )
})

let PanelTreePicker = observer(function PanelTreePicker({ options, checked }) {
  let nestedOptions = toNested(options)
  let [state] = React.useState(() => {
    let state = observable({
      selected: [],
      selectAtLevel: _.curry((level, key, field) => {
        if (isField(field)) {
          checked.has(field.value)
            ? checked.delete(field.value)
            : checked.set(field.value, field)
        } else {
          state.selected.splice(level, state.selected.length - level, key)
        }
      }),
    })
    return state
  })
  return (
    <div
      className="panel-tree-picker"
      style={{ display: 'inline-flex', width: '100%' }}
    >
      <Section
        checked={checked}
        options={nestedOptions}
        onClick={state.selectAtLevel(0)}
        selected={state.selected[0]}
      />
      {F.mapIndexed(
        (_key, index) => (
          <Section
            key={index}
            checked={checked}
            options={_.get(state.selected.slice(0, index + 1), nestedOptions)}
            onClick={state.selectAtLevel(index + 1)}
            selected={state.selected[index + 1]}
          />
        ),
        state.selected
      )}
    </div>
  )
})

let matchLabel = (str) => _.filter((x) => F.matchAllWords(str)(x.label))

export default function NestedPicker({
  options,
  onChange,
  PickerItem = 'div',
  itemType = 'filter',
  style = {},
  theme,
}) {
  theme = useTheme(theme)
  let [state] = React.useState(() =>
    observable({
      filter: '',
      checked: new Map(),
      hoverItem: null,
      get hasItemDescription() {
        return _.flow(_.trim, F.isNotBlank)(state.hoverItem?.description)
      },
    })
  )
  let showDescriptionPanel = _.some('description', options)
  return (
    <PickerContext.Provider
      value={{
        PickerItem,
        TextHighlight: theme.TextHighlight,
        setHoverItem: _.debounce(100, (item) => (state.hoverItem = item)),
      }}
    >
      <Flex style={style}>
        {showDescriptionPanel && (
          <Observer>
            {() => (
              <Flex
                alignItems="center"
                className="gv-picker-description-container"
                style={{
                  flexShrink: 0,
                  flexBasis: 200,
                  paddingLeft: 16,
                  paddingRight: 16,
                  textAlign: state.hasItemDescription ? 'left' : 'center',
                }}
              >
                {state.hasItemDescription ? (
                  <div>
                    <em>
                      <h4>{state.hoverItem.label}</h4>
                    </em>
                    <em>{state.hoverItem.description}</em>
                  </div>
                ) : (
                  <em>Hover over a field to view the description</em>
                )}
              </Flex>
            )}
          </Observer>
        )}
        <div style={{ padding: 16, flexGrow: 1 }}>
          <Observer>
            {() => (
              <>
                <theme.TextInput
                  style={{ marginBottom: 10 }}
                  value={state.filter}
                  onChange={(e) => (state.filter = e.target.value)}
                  placeholder="Enter filter keyword..."
                />
                {state.filter ? (
                  <FilteredSection
                    checked={state.checked}
                    highlight={state.filter}
                    options={matchLabel(state.filter)(options)}
                  />
                ) : (
                  <PanelTreePicker options={options} checked={state.checked} />
                )}
              </>
            )}
          </Observer>
          <Flex justifyContent="space-between" style={{ marginTop: 20 }}>
            <theme.Button
              onClick={() => {
                state.checked = new Map()
                onChange()
              }}
            >
              Cancel
            </theme.Button>
            <Observer>
              {() =>
                !!state.checked.size && (
                  <theme.Button
                    primary
                    onClick={() => onChange(Array.from(state.checked.values()))}
                  >
                    Add{' '}
                    {`${state.checked.size} ${pluralize(
                      itemType,
                      state.checked.size
                    )}`}
                  </theme.Button>
                )
              }
            </Observer>
          </Flex>
        </div>
      </Flex>
    </PickerContext.Provider>
  )
}
