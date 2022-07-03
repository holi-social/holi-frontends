import React from 'react'
import renderer from 'react-test-renderer'

import { Disabled, Multiline, NoLabel, Primary } from '@holi/web/stories/HoliTextInput.stories'

test('renders correctly with default props', () => {
  const tree = renderer.create(<Primary {...Primary.args} />).toJSON()
  expect(tree).toMatchSnapshot()
})

test('renders correctly without label', () => {
  const tree = renderer.create(<NoLabel {...NoLabel.args} />).toJSON()
  expect(tree).toMatchSnapshot()
})

test('renders correctly when disabled', () => {
  const tree = renderer.create(<Disabled {...Disabled.args} />).toJSON()
  expect(tree).toMatchSnapshot()
})

test('renders correctly when multiline', () => {
  const tree = renderer.create(<Multiline {...Multiline.args} />).toJSON()
  expect(tree).toMatchSnapshot()
})
