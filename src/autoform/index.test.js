import { autoform, fieldPath, fieldsValues, runValidator } from './index'

test('fieldPath', () => {
  expect(fieldPath('addresses')).toStrictEqual(['fields', 'addresses'])
  expect(fieldPath('addresses/name')).toStrictEqual([
    'fields',
    'addresses',
    'fields',
    'name',
  ])
  expect(fieldPath('addresses/1')).toStrictEqual([
    'fields',
    'addresses',
    'itemField',
  ])
  expect(fieldPath('addresses/1/name')).toStrictEqual([
    'fields',
    'addresses',
    'itemField',
    'fields',
    'name',
  ])
})

test('fieldsValues', () => {
  let values = {
    field1: 'value',
    arrayField: [1, 2, 3],
    anotherField: 'this should not get picked up',
  }
  let fields = {
    field1: { prop: 1 },
    field2: { value: 1 },
    field3: {},
    arrayField: { itemField: { a: 1 } },
    arrayFieldWithValue: { value: [4, 5, 6] },
  }
  expect(fieldsValues(values, fields)).toStrictEqual({
    field1: 'value',
    field2: 1,
    field3: undefined,
    arrayField: [1, 2, 3],
    arrayFieldWithValue: [4, 5, 6],
  })
})

test('runValidator', () => {
  let form = autoform({
    value: {},
    validate: () => 'form validator',
    fields: {
      nested: {
        validate: () => 'nested validator',
        fields: {
          name: {
            validate: () => undefined,
          },
          email: {
            validate: () => ['email validator'],
          },
        },
      },
    },
  })

  expect(runValidator(form)).toStrictEqual({
    '': ['form validator'],
    nested: ['nested validator'],
    'nested/email': ['email validator'],
  })

  expect(runValidator(form, 'nested')).toStrictEqual({
    nested: ['nested validator'],
    'nested/email': ['email validator'],
  })
})

test('runValidator: array fields', () => {
  let form = autoform({
    value: { colors: ['red', 'blue', 'green'] },
    fields: {
      colors: {
        itemField: {
          validate: x => `color is ${x}`,
        },
      },
    },
  })
  expect(runValidator(form)).toStrictEqual({
    'colors/0': ['color is red'],
    'colors/1': ['color is blue'],
    'colors/2': ['color is green'],
  })
})
