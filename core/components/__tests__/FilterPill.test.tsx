import { fireEvent, render, screen } from '@testing-library/react-native'
import React from 'react'

import FilterPill, { FilterPillButton } from '@holi/core/components/FilterPill'

describe('FilterPill', () => {
  it('renders correctly', () => {
    render(<FilterPill filterType="generic" label="generic filter" />)
    expect(screen).toMatchSnapshot()

    render(<FilterPill filterType="location" label="location filter" />)
    expect(screen).toMatchSnapshot()

    render(<FilterPill filterType="topic" label="topic filter" />)
    expect(screen).toMatchSnapshot()

    render(<FilterPill filterType="skill" label="skill filter" />)
    expect(screen).toMatchSnapshot()
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
