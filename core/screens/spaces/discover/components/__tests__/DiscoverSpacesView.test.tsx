import { MockedProvider } from '@apollo/client/testing'
import { render } from '@testing-library/react-native'
import React, { type PropsWithChildren } from 'react'

import type { Skill, Topic } from '@holi/core/domain/shared/types'
import DiscoverSpacesView, {
  SPACES_GROUP_LIMIT,
  SPACES_SLIDER_SKELETONS,
} from '@holi/core/screens/spaces/discover/components/DiscoverSpacesView'
import {
  SpaceTermContext,
  type SpaceTermContextResult,
} from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'

jest.mock('@holi/core/auth/hooks/useLoggedInUser', () => ({
  useLoggedInUser: () => ({
    isLoggedIn: true,
  }),
}))

const ScrollBasedRenderMock = ({ children }: PropsWithChildren) => <>{children}</>
jest.mock('@holi/core/components/ScrollBasedRender', () => ScrollBasedRenderMock)

const defaultTopics: Topic[] = [
  { id: '1', title: 'Topic 1', slug: 'topic-1', isDiscoverSpacesDefault: true },
  { id: '2', title: 'Topic 2', slug: 'topic-2', isDiscoverSpacesDefault: true },
]

const userTopics: Topic[] = [defaultTopics[0]]

const userSkills: Skill[] = [
  { id: '1', title: 'Skill 1', slug: 'skill-1' },
  { id: '2', title: 'Skill 2', slug: 'skill-2' },
]

const spaceTermContext: SpaceTermContextResult = {
  loadingTopics: false,
  loadingSkills: false,
  loadingSdgs: false,
  failedTopics: false,
  failedSkills: false,
  failedSdgs: false,
  topics: defaultTopics,
  skills: [],
  sdgs: [],
}

// prevent logging about incomplete apollo mocks,
// because we didn't flesh out the response data
global.console.error = jest.fn()
global.console.warn = jest.fn()

const renderDiscoverSpaces = (
  userTopics: Topic[] = [],
  userSkills: Skill[] = [],
  userGeolocationId?: string,
  contextProps: Partial<SpaceTermContextResult> = {}
) => {
  return render(
    <MockedProvider mocks={[]} addTypename={false}>
      <SpaceTermContext.Provider value={{ ...spaceTermContext, ...contextProps }}>
        <DiscoverSpacesView userSkills={userSkills} userTopics={userTopics} userGeolocationId={userGeolocationId} />
      </SpaceTermContext.Provider>
    </MockedProvider>
  )
}

describe('DiscoverSpacesView', () => {
  it('renders correctly, without user spaces, when loading', async () => {
    const { queryAllByTestId } = renderDiscoverSpaces([], [], undefined, { topics: [] })

    expect(queryAllByTestId('space-link-loading')).toHaveLength(SPACES_SLIDER_SKELETONS * SPACES_GROUP_LIMIT)

    expect(queryAllByTestId('discover-topics-slider-user-specific')).toHaveLength(0)
    expect(queryAllByTestId('discover-skills-slider-user-specific')).toHaveLength(0)
    expect(queryAllByTestId('discover-topic-slider-others')).toHaveLength(0)
  })

  it('renders correctly, without user spaces, when loaded', async () => {
    const { queryAllByTestId, getByText } = renderDiscoverSpaces()

    expect(queryAllByTestId('discover-topics-slider-user-specific')).toHaveLength(0)
    expect(queryAllByTestId('discover-skills-slider-user-specific')).toHaveLength(0)

    expect(queryAllByTestId('discover-topic-slider-others')).toHaveLength(defaultTopics.length)
    expect(queryAllByTestId('space-link-loading')).toHaveLength(defaultTopics.length * SPACES_GROUP_LIMIT)

    expect(getByText('Topic 1')).toBeDefined()
    expect(getByText('Topic 2')).toBeDefined()
  })

  it('renders correctly, with user spaces, when loading', async () => {
    const { queryAllByTestId } = renderDiscoverSpaces(userTopics, userSkills, undefined, {
      topics: [],
    })

    expect(queryAllByTestId('space-link-loading')).toHaveLength(
      (userTopics.length + userSkills.length + SPACES_SLIDER_SKELETONS) * SPACES_GROUP_LIMIT
    )

    expect(queryAllByTestId('discover-topics-slider-user-specific')).toHaveLength(1)
    expect(queryAllByTestId('discover-skills-slider-user-specific')).toHaveLength(2)
    expect(queryAllByTestId('discover-topic-slider-others')).toHaveLength(0)
  })

  it('renders correctly, with user spaces, when loaded', async () => {
    const { queryAllByTestId } = renderDiscoverSpaces(userTopics, userSkills)

    expect(queryAllByTestId('space-link-loading')).toHaveLength(
      (defaultTopics.length + userSkills.length) * SPACES_GROUP_LIMIT
    )

    expect(queryAllByTestId('discover-topics-slider-user-specific')).toHaveLength(1)
    expect(queryAllByTestId('discover-skills-slider-user-specific')).toHaveLength(2)
    expect(queryAllByTestId('discover-topic-slider-others')).toHaveLength(1)
  })

  it('renders correctly, without default spaces, when loaded', async () => {
    const { queryAllByTestId } = renderDiscoverSpaces(defaultTopics, userSkills)

    expect(queryAllByTestId('discover-topics-slider-user-specific')).toHaveLength(2)
    expect(queryAllByTestId('discover-skills-slider-user-specific')).toHaveLength(2)
    expect(queryAllByTestId('discover-topic-slider-others')).toHaveLength(0) // filtered by user topics
  })
})
