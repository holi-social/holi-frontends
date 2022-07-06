import React from 'react'
import renderer from 'react-test-renderer'

import {
  Disabled,
  Multiline,
  MultilineVariant,
  NoLabel,
  Password,
  Primary,
  WithError,
  WithTrailingIcon,
} from '@holi/ui/components/__stories__/HoliTextInput.stories'

test('renders correctly with default props', () => {
  const tree = renderer.create(<Primary {...Primary.args} />).toJSON()
  expect(tree).toMatchSnapshot()
})

test('renders correctly with error', () => {
  const tree = renderer.create(<WithError {...WithError.args} />).toJSON()
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

test('renders correctly when multiline starting with one line', () => {
  const tree = renderer.create(<Multiline {...Multiline.args} />).toJSON()
  expect(tree).toMatchSnapshot()
})

test('renders correctly when multiline starting with more than one line', () => {
  const tree = renderer.create(<MultilineVariant {...MultilineVariant.args} />).toJSON()
  expect(tree).toMatchSnapshot()
})

test('renders correctly with trailing icon', () => {
  const tree = renderer.create(<WithTrailingIcon {...WithTrailingIcon.args} />).toJSON()
  expect(tree).toMatchSnapshot()
})

test('renders correctly with type password', () => {
  const tree = renderer.create(<Password {...Password.args} />).toJSON()
  expect(tree).toMatchSnapshot()
})
