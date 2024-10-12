import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import FilterPill, { FilterPillButton } from '@holi/core/components/FilterPill'

describe('FilterPill', () => {
  it('renders correctly', () => {
    const generic = renderer.create(<FilterPill filterType="generic" label="generic filter" />).toJSON()
    expect(generic).toMatchSnapshot()

    const location = renderer.create(<FilterPill filterType="location" label="location filter" />).toJSON()
    expect(location).toMatchSnapshot()

    const topic = renderer.create(<FilterPill filterType="topic" label="topic filter" />).toJSON()
    expect(topic).toMatchSnapshot()

    const skill = renderer.create(<FilterPill filterType="skill" label="skill filter" />).toJSON()
    expect(skill).toMatchSnapshot()
  })

  it('triggers the onPress method correctly', async () => {
    const onPress = jest.fn()
    const { getByTestId } = render(
      <FilterPillButton filterType="skill" label="skill filter" onPress={onPress} testID="test" />
    )

    fireEvent.press(getByTestId('test'))

    expect(onPress).toHaveBeenCalled()
  })
})
