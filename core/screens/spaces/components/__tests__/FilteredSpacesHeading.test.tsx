import { render } from '@testing-library/react-native'
import React from 'react'

import FilteredSpacesHeading from '@holi/core/screens/spaces/components/FilteredSpacesHeading'
import { SpaceTermContext } from '@holi/core/screens/spaces/components/SpaceTermContextProvider'
import { Skill, Topic } from '@holi/core/screens/userprofile/types'

const topics: Topic[] = [
  { id: '1', title: 'Topic 1', slug: 'topic-1', isDiscoverSpacesDefault: false },
  { id: '2', title: 'Topic 2', slug: 'topic-2', isDiscoverSpacesDefault: false },
]

const skills: Skill[] = [
  { id: '1', title: 'Skill 1', slug: 'skill-1' },
  { id: '2', title: 'Skill 2', slug: 'skill-2' },
]

const spaceTermContext = {
  loading: false,
  loadingFailed: false,
  topics,
  skills,
}

describe('FilteredSpacesHeading', () => {
  it('applies correct title when filtering for location only', () => {
    render(
      <SpaceTermContext.Provider value={spaceTermContext}>
        <FilteredSpacesHeading location="Hamburg" />
      </SpaceTermContext.Provider>
    )

    expect(mockSetOptions).toHaveBeenCalledWith({ title: 'Hamburg' })
  })

  it('applies correct title when filtering for topic only', () => {
    render(
      <SpaceTermContext.Provider value={spaceTermContext}>
        <FilteredSpacesHeading topicSlug="topic-1" />
      </SpaceTermContext.Provider>
    )

    expect(mockSetOptions).toHaveBeenCalledWith({ title: 'Topic 1' })
  })

  it('applies correct title when filtering for single skill', () => {
    render(
      <SpaceTermContext.Provider value={spaceTermContext}>
        <FilteredSpacesHeading skillSlugs={['skill-1']} />
      </SpaceTermContext.Provider>
    )

    expect(mockSetOptions).toHaveBeenCalledWith({ title: 'Skill 1' })
  })

  it('applies generic title when filtering for multiple skills', () => {
    render(
      <SpaceTermContext.Provider value={spaceTermContext}>
        <FilteredSpacesHeading skillSlugs={['skill-1', 'skill-2']} />
      </SpaceTermContext.Provider>
    )

    expect(mockSetOptions).toHaveBeenCalledWith({ title: 'spaces.title.filtered' })
  })

  it('applies generic title when applying multiple filters', () => {
    render(
      <SpaceTermContext.Provider value={spaceTermContext}>
        <FilteredSpacesHeading topicSlug="topic-1" location="Hamburg" />
      </SpaceTermContext.Provider>
    )

    expect(mockSetOptions).toHaveBeenCalledWith({ title: 'spaces.title.filtered' })
  })

  it('applies generic title while loading terms', () => {
    render(
      <SpaceTermContext.Provider value={{ ...spaceTermContext, loading: true }}>
        <FilteredSpacesHeading topicSlug="topic-1" />
      </SpaceTermContext.Provider>
    )

    expect(mockSetOptions).toHaveBeenCalledWith({ title: 'spaces.title.filtered' })
  })

  it('applies generic title when loading of terms failed', () => {
    render(
      <SpaceTermContext.Provider value={{ ...spaceTermContext, loadingFailed: true }}>
        <FilteredSpacesHeading topicSlug="topic-1" />
      </SpaceTermContext.Provider>
    )

    expect(mockSetOptions).toHaveBeenCalledWith({ title: 'spaces.title.filtered' })
  })
})
