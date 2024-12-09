import { MockedProvider } from '@apollo/client/testing'
import { cleanup, render, waitFor } from '@testing-library/react-native'
import React from 'react'

import type { SDG, Skill, Topic } from '@holi/core/domain/shared/types'
import { locationDetailsMock } from '@holi/core/screens/spaces/__tests__/mocks'
import { locationId } from '@holi/core/screens/spaces/__tests__/testData'
import FilteredSpacesHeading, {
  type FilteredSpacesHeadingProps,
} from '@holi/core/screens/spaces/filter/components/FilteredSpacesHeading'
import {
  SpaceTermContext,
  type SpaceTermContextResult,
} from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'

const topics: Topic[] = [
  { id: '1', title: 'Topic 1', slug: 'topic-1', isDiscoverSpacesDefault: false },
  { id: '2', title: 'Topic 2', slug: 'topic-2', isDiscoverSpacesDefault: false },
]

const skills: Skill[] = [
  { id: '1', title: 'Skill 1', slug: 'skill-1' },
  { id: '2', title: 'Skill 2', slug: 'skill-2' },
]

const sdgs: SDG[] = [
  { id: '1', title: 'SDG 1', slug: 'SDG-1', number: 1 },
  { id: '2', title: 'SDG 2', slug: 'SDG-2', number: 2 },
]

const spaceTermContext: SpaceTermContextResult = {
  loadingTopics: false,
  loadingSkills: false,
  loadingSdgs: false,
  failedTopics: false,
  failedSkills: false,
  failedSdgs: false,
  topics,
  skills,
  sdgs,
}

const renderHeading = (props: FilteredSpacesHeadingProps, contextProps: Partial<SpaceTermContextResult> = {}) =>
  render(
    <MockedProvider mocks={[locationDetailsMock]} addTypename={false}>
      <SpaceTermContext.Provider value={{ ...spaceTermContext, ...contextProps }}>
        <FilteredSpacesHeading {...props} />
      </SpaceTermContext.Provider>
    </MockedProvider>
  )

describe('FilteredSpacesHeading', () => {
  it('applies correct title when filtering for location only', async () => {
    renderHeading({ locationId })

    await waitFor(() => expect(mockSetOptions).toHaveBeenCalledTimes(2))
    expect(mockSetOptions).toHaveBeenCalledWith({ title: 'spaces.title.filtered' })
    expect(mockSetOptions).toHaveBeenCalledWith({ title: 'Hamburg, Germany' })
  })

  it('applies correct title when filtering for topic only', () => {
    renderHeading({ topicSlugs: ['topic-1'] })

    expect(mockSetOptions).toHaveBeenCalledWith({ title: 'Topic 1' })
  })

  it('applies correct title when filtering for single skill', () => {
    renderHeading({ skillSlugs: ['skill-1'] })

    expect(mockSetOptions).toHaveBeenCalledWith({ title: 'Skill 1' })
  })

  it('applies generic title when filtering for multiple skills', () => {
    renderHeading({ skillSlugs: ['skill-1', 'skill-2'] })

    expect(mockSetOptions).toHaveBeenCalledWith({ title: 'spaces.title.filtered' })
  })

  it('applies generic title when applying multiple filters', () => {
    renderHeading({ topicSlugs: ['topic-1'], locationId: '123' })

    expect(mockSetOptions).toHaveBeenCalledWith({ title: 'spaces.title.filtered' })
  })

  it('applies generic title while loading terms', () => {
    renderHeading({ topicSlugs: ['topic-1'] }, { loadingTopics: true })

    expect(mockSetOptions).toHaveBeenCalledWith({ title: 'spaces.title.filtered' })
  })

  it('applies generic title when loading of terms failed', () => {
    renderHeading({ topicSlugs: ['topic-1'] }, { failedTopics: true })

    expect(mockSetOptions).toHaveBeenCalledWith({ title: 'spaces.title.filtered' })
  })

  // solve act() wrap warning
  // https://github.com/testing-library/react-testing-library/issues/1216#issuecomment-1595684566
  afterEach(cleanup)
})
