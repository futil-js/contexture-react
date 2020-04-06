import React from 'react'
import { Grid } from 'grey-vest'
import { useTheme } from '..'
import { memoryService } from '../MemoryTable'
import ThemePicker from '../stories/themePicker'
import ContextureMobx from '../utils/contexture-mobx'
import TestTree from './stories/testTree'
import { Facet, FacetSelect, ResultTable } from '.'

export default {
  title: 'ExampleTypes | Facet',
  component: Facet,
  decorators: [ThemePicker('greyVest')],
}

export let facet = () => <Facet tree={TestTree()} path={['facet']} />

export let facetSelect = () => (
  <FacetSelect tree={TestTree()} path={['facet']} />
)

export let emojiDataset = () => {
  let data = require('emoji-datasource')
  let service = memoryService(data)
  let tree = ContextureMobx({ service })({
    key: 'root',
    children: [{ type: 'facet', field: 'category' }, { type: 'results' }],
  })
  tree.refresh(['root'])
  let { Box } = useTheme()
  return (
    <Grid columns="1fr 3fr" gap="md">
      <Facet tree={tree} path={['root', 'category-facet']} />
      <Box style={{ overflow: 'auto' }} padding={0}>
        <ResultTable
          infer
          tree={tree}
          path={['root', 'results']}
          fields={{ category: { order: 1 } }}
        />
      </Box>
    </Grid>
  )
}
