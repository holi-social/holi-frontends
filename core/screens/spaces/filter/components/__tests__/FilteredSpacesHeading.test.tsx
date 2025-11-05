import { MockedProvider } from '@apollo/client/testing/react'
import { cleanup, waitFor } from '@testing-library/react-native'
import { renderRouter } from 'expo-router/testing-library'
import React from 'react'

import { locationDetailsMock } from '@holi/core/screens/spaces/__tests__/mocks'
import { locationId } from '@holi/core/screens/spaces/__tests__/testData'
import FilteredSpacesHeading, {
  type FilteredSpacesHeadingProps,
} from '@holi/core/screens/spaces/filter/components/FilteredSpacesHeading'

const mockSetScreenOptions = jest.fn()
jest.mock('@holi/core/navigation/hooks/useScreenOptions', () => ({
  useSetScreenOptions: () => mockSetScreenOptions,
}))

const renderHeading = (props: FilteredSpacesHeadingProps) =>
  renderRouter({
    index: () => (
      <MockedProvider mocks={[locationDetailsMock]}>
        <FilteredSpacesHeading {...props} />
      </MockedProvider>
    ),
  })

describe('FilteredSpacesHeading', () => {
  beforeEach(() => {
    mockSetScreenOptions.mockClear()
  })

  it('applies correct title when filtering for location only', async () => {
    renderHeading({ locationId })

    await waitFor(() => expect(mockSetScreenOptions).toHaveBeenCalledTimes(2))
    expect(mockSetScreenOptions).toHaveBeenCalledWith(expect.objectContaining({ title: 'spaces.title.filtered' }))
    expect(mockSetScreenOptions).toHaveBeenCalledWith(expect.objectContaining({ title: 'Hamburg, Germany' }))
  })

  it('applies correct title when filtering for topic only', () => {
    renderHeading({ topicSlugs: ['topic-1'] })

    expect(mockSetScreenOptions).toHaveBeenCalledWith(expect.objectContaining({ title: 'topic.topic-1' }))
  })

  it('applies correct title when filtering for single skill', () => {
    renderHeading({ skillSlugs: ['skill-1'] })

    expect(mockSetScreenOptions).toHaveBeenCalledWith(expect.objectContaining({ title: 'skill.skill-1' }))
  })

  it('applies generic title when filtering for multiple skills', () => {
    renderHeading({ skillSlugs: ['skill-1', 'skill-2'] })

    expect(mockSetScreenOptions).toHaveBeenCalledWith(expect.objectContaining({ title: 'spaces.title.filtered' }))
  })

  it('applies generic title when applying multiple filters', () => {
    renderHeading({ topicSlugs: ['topic-1'], locationId: '123' })

    expect(mockSetScreenOptions).toHaveBeenCalledWith(expect.objectContaining({ title: 'spaces.title.filtered' }))
  })

  // solve act() wrap warning
  // https://github.com/testing-library/react-testing-library/issues/1216#issuecomment-1595684566
  afterEach(cleanup)
})
