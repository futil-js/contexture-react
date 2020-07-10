import * as f from './futil'

test('flattenTreeLeaves', () => {
  expect(
    f.flattenTreeLeaves()()({
      field1: {
        field2: 'value',
      },
      arrayField: [1, 2, 3],
      anotherField: [],
    })
  ).toStrictEqual({
    'field1.field2': 'value',
    'arrayField.0': 1,
    'arrayField.1': 2,
    'arrayField.2': 3,
  })
})

test('unflattenTree', () => {
  expect(
    f.unflattenTree(f.pathEncoder.decode)({
      '/field1': 'value',
      '/field2/field3': 1,
      '/field4': undefined,
      '/arrayField/0': 1,
      '/arrayField/1': 2,
      '/arrayField/2': 3,
    })
  ).toStrictEqual({
    field1: 'value',
    field2: { field3: 1 },
    field4: undefined,
    arrayField: [1, 2, 3],
  })
})
