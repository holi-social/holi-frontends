import React from 'react'
import { View } from 'react-native'
import renderer from 'react-test-renderer'

import HoliReadMore from '@holi/ui/components/molecules/HoliReadMore'

/**
 * These tests are limited to snapshot tests because this component heavily relies on an ellipsis (text-overflow)
 * and this rendering is not supported by the @testing-library - https://github.com/testing-library/react-testing-library/issues/751
 */
describe('renders correctly', () => {
  it('renders correctly with long text', () => {
    const tree = renderer
      .create(
        <View>
          <HoliReadMore>
            I enjoy working on community projects during my spare time. This text cannot exceed three lines or else.
            This text cannot exceed three lines or else. This text cannot exceed.
          </HoliReadMore>
        </View>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
  it('renders correctly with short text', () => {
    const tree = renderer
      .create(
        <View>
          <HoliReadMore>I enjoy working on community projects.</HoliReadMore>
        </View>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
