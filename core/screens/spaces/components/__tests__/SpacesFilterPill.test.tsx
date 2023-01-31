import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import SpacesFilterPill from '@holi/core/screens/spaces/components/SpacesFilterPill'

describe('SpacesFilterPill', () => {
  it('renders correctly', () => {
    const generic = renderer
      .create(<SpacesFilterPill filterType="generic" label="generic filter" onPress={() => null} />)
      .toJSON()
    expect(generic).toMatchSnapshot()

    const location = renderer
      .create(<SpacesFilterPill filterType="location" label="location filter" onPress={() => null} />)
      .toJSON()
    expect(location).toMatchSnapshot()

    const topic = renderer
      .create(<SpacesFilterPill filterType="topic" label="topic filter" onPress={() => null} />)
      .toJSON()
    expect(topic).toMatchSnapshot()

    const skill = renderer
      .create(<SpacesFilterPill filterType="skill" label="skill filter" onPress={() => null} />)
      .toJSON()
    expect(skill).toMatchSnapshot()
  })

  it('triggers the onPress method correctly', () => {
    const onPress = jest.fn()
    const { getByTestId } = render(
      <SpacesFilterPill filterType="skill" label="skill filter" onPress={onPress} testID="test" />
    )

    fireEvent.press(getByTestId('test'))

    expect(onPress).toHaveBeenCalled()
  })
})
