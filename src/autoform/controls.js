import _ from 'lodash/fp'
import F from 'futil'
import * as f from './futil'
import React from 'react'
import * as Theme from '../greyVest'
import { forwardRefObserver } from './layout'
import { getValue, setValue } from './index'

let FormControl = ({
  as: Component,
  encode = f.whenUndefined(''),
  decode = _.get('target.value'),
  mapProps = _.identity,
}) =>
  forwardRefObserver(({ path, form, ...props }, ref) => (
    <Component
      ref={ref}
      value={encode(getValue(form, path))}
      onChange={x => setValue(decode(x), form, path)}
      {..._.merge(mapProps(props), {
        style: {
          borderColor: !_.isEmpty(_.get(path, form.errors)) && '#D75050',
        },
      })}
    />
  ))

export let Input = FormControl({
  as: Theme.TextInput,
})

export let TextArea = FormControl({
  as: Theme.Textarea,
  mapProps: _.merge({ style: { minHeight: 100, resize: 'vertical' } }),
})

export let Select = FormControl({
  as: Theme.Select,
  mapProps: _.update('options', F.autoLabelOptions),
})

export let Checkbox = FormControl({
  as: Theme.Checkbox,
  encode: f.whenUndefined(false),
})

export let DateInput = FormControl({
  as: Theme.DateInput,
  decode: _.identity,
})

let safeJson = {
  parse: F.when(_.isString, JSON.parse),
  stringify: f.whenDefined(JSON.stringify),
}

export let ObjectSelect = FormControl({
  as: Theme.Select,
  encode: safeJson.stringify,
  decode: _.flow(_.get('target.value'), safeJson.parse),
  mapProps: _.update(
    'options',
    _.flow(F.autoLabelOptions, _.map(_.update('value', safeJson.stringify)))
  ),
})

export let CheckboxList = FormControl({
  as: Theme.CheckboxList,
  encode: f.whenUndefined([]),
  decode: _.identity,
  mapProps: _.update('options', F.autoLabelOptions),
})
