import _ from 'lodash/fp'
import F from 'futil'
import * as f from './futil.js'
import React from 'react'
import { reaction } from 'mobx'
import { observer } from 'mobx-react'
import ValidatorJS from 'validatorjs'
import { storiesOf } from '@storybook/react'
import ThemePicker from '../stories/themePicker'
import { Grid, GridItem, Flex, Modal } from '../greyVest'
import {
  autoform,
  functionsValidator,
  getValue,
  setValue,
  getField,
} from './index'
import { Field, FieldList, SimpleForm } from './layout'
import {
  Input,
  Select,
  ObjectSelect,
  Checkbox,
  CheckboxList,
  TextArea,
  DateInput,
} from './controls'
import { USCounties } from './usData'

let getFieldLabel = (form, path) =>
  getField(form, path).label || _.startCase(_.last(f.slashEncoder.decode(path)))

let rulesValidator = (values, rules, form) => {
  let validatorJS = new ValidatorJS(values, rules)
  validatorJS.setAttributeNames(
    F.mapValuesIndexed((rule, path) => getFieldLabel(form, path), rules)
  )
  validatorJS.fails() // Trigger validation
  return validatorJS.errors.all()
}

let validator = (values, validates, form) => ({
  // Standard validation
  ...F.unless(
    _.isEmpty,
    fns => functionsValidator(_.pick(_.keys(fns), values), fns),
    _.pickBy(_.isFunction, validates)
  ),
  // Rules validation
  ...F.unless(
    _.isEmpty,
    rules => rulesValidator(_.pick(_.keys(rules), values), rules, form),
    _.pickBy(_.negate(_.isFunction), validates)
  ),
})

let RequestForm = observer(({ form }) => (
  <Flex
    column
    justifyContent="center"
    alignItems="center"
    style={{ height: '100%', margin: '24px 0' }}
  >
    <SimpleForm
      form={form}
      submitLabel="Save"
      cancelLabel="Reset"
      onCancel={form.view.reset}
      style={{ width: 600 }}
    />
    <Modal
      isOpen={!!form.submitData}
      onClose={() => F.setOn('submitData', null, form)}
    >
      <h1>Submit Data</h1>
      <pre style={{ marginTop: 24 }}>
        {JSON.stringify(form.submitData, null, 2)}
      </pre>
    </Modal>
  </Flex>
))

let addresses = [
  {
    isPrimary: true,
    address: {
      address1: 'CA-123',
      address2: '',
      city: 'Berkeley',
      county: 'Alameda',
      state: 'California',
      zip: '94702',
      country: 'USA',
      latitude: 37.85964,
      longitude: -122.28903,
    },
    name: 'Primary',
  },
  {
    isPrimary: false,
    address: {
      address1: '417 Orchard St',
      address2: '',
      city: 'New Haven',
      county: 'New Haven',
      state: 'Connecticut',
      zip: '06511',
      country: 'USA',
      latitude: 41.3127037,
      longitude: -72.9405799,
    },
    name: '417 Orchard',
  },
  {
    isPrimary: false,
    address: {
      address1: '123123',
      address2: '123',
      city: 'asdf',
      county: 'Aleutians West Census Area',
      state: 'Alaska',
      zip: '123123',
      country: '',
    },
  },
]

let displayAddress = ({ address1, city, zip }) => `${address1}, ${city} ${zip}`

export let addressField = {
  fields: _.mapValues(_.set('hideLabel', true), {
    address1: { component: { as: Input } },
    address2: { component: { as: Input, placeholder: 'Apt, Unit, etc...' } },
    city: { component: { as: Input, placeholder: 'City' } },
    state: {
      component: {
        as: Select,
        placeholder: 'Select State...',
        options: _.keys(USCounties),
      },
    },
    county: {
      component: {
        as: Select,
        placeholder: 'Select County...',
        useEffect: ({ path, form, field }) =>
          reaction(
            () => USCounties[getValue(form, f.siblingPath(path, 'state'))],
            counties => {
              field.component.options = counties
              let county = _.find(_.eq(getValue(form, path)), counties)
              setValue(county, form, path)
            },
            { fireImmediately: true }
          ),
      },
    },
    zip: { component: { as: Input, placeholder: 'Zip Code' } },
    country: { component: { type: 'hidden' } },
    latitude: { component: { type: 'hidden' } },
    longitude: { component: { type: 'hidden' } },
  }),
  component: {
    as: ({ path, ...props }) => (
      <Grid
        columns={4}
        rows="repeat(auto-fill, minmax(10px, min-content))"
        gap={8}
        {..._.omit('form', props)}
      >
        <GridItem as={Field} width={3} path={f.joinPaths(path, 'address1')} />
        <Field path={f.joinPaths(path, 'address2')} />
        <Field path={f.joinPaths(path, 'state')} />
        <Field path={f.joinPaths(path, 'county')} />
        <Field path={f.joinPaths(path, 'city')} />
        <Field path={f.joinPaths(path, 'zip')} />
      </Grid>
    ),
  },
}

let requestFields = {
  title: {
    label: 'Request Name',
    description: 'This is name of the request as displayed to all companies.',
    component: { as: Input, placeholder: 'Enter a name...' },
  },
  description: {
    description:
      'Enter all the details of your request here. Include the items and services that you need to purchase or be performed as well as any other requirements or details.',
    component: {
      as: TextArea,
      placeholder:
        'Enter a description of your request. Include information such as products, services, part numbers, quantities, and anything else you can think of to improve the accuracy of the quotes you will receive. The more detailed your requests are, the more detailed your quotes will be',
    },
  },
  // Example of setting options post-form initialization
  maxResponses: {
    value: 0,
    label: 'Maximum Quotes',
    description:
      'When the limit is met, the request is no longer visible to new companies. Companies respond quicker with limited slots.',
    component: { as: Select, placeholder: null },
  },
  dueAt: {
    label: 'Due',
    description:
      'This is the date responses are needed by. When the due date is met, the request will no longer receive any new quotes.',
    component: {
      as: DateInput,
      minDate: new Date(),
      maxDate: new Date('01/01/2100'),
    },
  },
  notify: {
    label: 'Notify',
    description: 'Choose who to notify about this request.',
    component: {
      as: Select,
      placeholder: null,
      options: [
        { label: 'All relevant companies', value: 'relevant' },
        {
          label: 'Relevant companies based on socio-economic classifications',
          value: 'socio',
        },
        {
          label: "Nobody (I'll send the link out myself)",
          value: 'nobody',
        },
      ],
    },
  },
  socioEconomics: {
    label: 'Select the socio-economic classes that should be notified…',
    validate: 'required',
    component: {
      as: CheckboxList,
      options: [
        'State of Texas HUB Vendor',
        'Small Business',
        'Veteran Owned Business',
        'Minority Owned Business',
        'Woman Owned Business',
        'African American Owned Business',
        'Hispanic American Owned Business',
        'Native American Owned Business',
        'SBA-Certified Small Disadvantaged Business',
        'SBA-Certified HUB Zone Firm',
        'SBA-Certified 8(a) Firm',
        'Woman Owned Small Business (WOSB)',
        'Economically Disadvantaged Women Owned Small Business (EDWOSB)',
        'Service Disabled Veteran Owned Business (SDVOSB)',
      ],
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridGap: '10px 0',
      },
    },
  },
  addressBook: {
    label: 'Address Book',
    description: 'Auto-fill the service address from your address book',
    component: {
      as: ObjectSelect,
      placeholder: null,
      options: _.map(
        ({ name, address }) => ({
          label: name || displayAddress(address),
          value: address,
        }),
        addresses
      ),
    },
  },
  serviceAddress: _.merge(addressField, {
    value: _.get('address', _.find({ isPrimary: true }, addresses)),
    label: 'Service Address',
  }),
  saveToAddressBook: { component: { as: Checkbox } },
  customRequestFormValues: {
    hideLabel: true,
    component: { as: FieldList },
    fields: {
      customField1: { validate: 'required', component: { as: Input } },
      customField2: {
        component: { as: Select, options: ['option1', 'option2'] },
      },
    },
  },
}

storiesOf('Search Components|Form', module)
  .addDecorator(ThemePicker('greyVest'))
  .add('Form', () => {
    let form = autoform({
      label: 'Create a new Request for Quote (RFC)',
      description:
        'A Request for Quote (RFC) is the primary means by which government agencies request private companies for quotes on services and/or products they need',
      component: { as: FieldList },
      fields: requestFields,
      validator,
      submit: form => F.setOn('submitData', getValue(form), form),
    })
    return <RequestForm form={form} />
  })
