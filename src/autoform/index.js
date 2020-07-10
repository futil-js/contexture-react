import _ from 'lodash/fp'
import F from 'futil'
import * as f from './futil'
import { observable } from 'mobx'
import { createViewModel } from 'mobx-utils'

// Custom traversal function for form fields
// If field is an array field, return an array of itemFields the same size as
// the size of the array value so we can keep iterating. Otherwise return
// nested object fields
let traverseField = value => (field, ...xs) => {
  if (!field) return
  if (field.itemField)
    return _.times(
      _.constant(field.itemField),
      _.size(_.get(f.treePath(field, ...xs), value))
    )
  return field.fields
}

let buildPath = _.flow(f.treePath, f.slashEncoder.encode)

let flattenField = value => F.flattenTree(traverseField(value))(buildPath)

let flattenFieldLeaves = value =>
  f.flattenTreeLeaves(traverseField(value))(buildPath)

let flattenValue = F.flattenTree()(buildPath)

let flattenValueLeaves = f.flattenTreeLeaves()(buildPath)

export let fieldsValues = (value, fields) => {
  let leaves = _.mapValues('value', flattenFieldLeaves(value)({ fields }))
  let values = _.pick(_.keys(leaves), flattenValueLeaves(value))
  return f.unflattenTree(f.slashEncoder.decode)(_.merge(leaves, values))
}

let viewModelInternalKeys = [
  'model',
  'reset',
  'submit',
  'isDirty',
  'isPropertyDirty',
  'changedValues',
  'resetProperty',
  'localValues',
  'localComputedValues',
]

export let fieldPath = path =>
  _.reduce(
    (path, x) =>
      _.isNaN(parseInt(x)) ? [...path, 'fields', x] : [...path, 'itemField'],
    [],
    f.slashEncoder.decode(path)
  )

export let getValue = (form, path) =>
  _.isEmpty(path)
    ? _.omit(viewModelInternalKeys, form.view)
    : _.get(f.slashEncoder.decode(path), form.view)

export let setValue = (value, form, path) =>
  !_.isEmpty(path) && F.setOn(f.slashEncoder.decode(path), value, form.view)

export let getField = (form, path) =>
  _.isEmpty(path) ? form : _.get(fieldPath(path), form)

export let runValidator = (form, path) => {
  let value = getValue(form, path)
  let field = getField(form, path)

  let validates = _.flow(
    _.mapValues('validate'),
    F.compactObject
  )(flattenField(value)(field))

  let flatValues = _.pick(_.keys(validates), flattenValue(value))

  return _.flow(
    _.omitBy(_.isEmpty),
    _.mapValues(_.castArray),
    _.mapKeys(f.joinPaths(path))
  )(form.validator(flatValues, validates, form))
}

export let validate = (form, path = '') => {
  let errors = runValidator(form, path)
  form.errors = {
    ...F.pickByIndexed((x, k) => !_.startsWith(path, k), form.errors),
    ...errors,
  }
  return errors
}

export let functionsValidator = _.mergeWith((x, fn) =>
  F.when(_.isUndefined, null, fn(x))
)

export let autoform = ({
  value,
  fields,
  submit = _.noop,
  validator = functionsValidator,
  ...rest
}) => {
  let form = observable({
    view: createViewModel(observable(fieldsValues(value, fields))),
    submit: f.Command(() =>
      _.isEmpty(validate(form)) ? submit(form) : F.throws('Validation Error')
    ),
    validator,
    errors: {},
    fields,
    ...rest,
  })
  return form
}
