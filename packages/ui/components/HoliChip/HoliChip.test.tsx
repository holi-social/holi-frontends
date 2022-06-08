import { expect, test } from '@jest/globals'
import React from 'react'
import renderer from 'react-test-renderer'

import HoliChip from './index'

test('renders correctly', () => {
  const tree = renderer.create(<HoliChip>hello</HoliChip>).toJSON()
  expect(tree).toMatchSnapshot()
})
