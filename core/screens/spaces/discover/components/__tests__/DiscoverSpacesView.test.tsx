import { MockedProvider } from '@apollo/client/testing'
import { renderRouter, screen, waitFor } from 'expo-router/testing-library'
import React, { type PropsWithChildren } from 'react'

import DiscoverSpacesView, {
  SPACES_GROUP_LIMIT,
  SPACES_SLIDER_SKELETONS,
} from '@holi/core/screens/spaces/discover/components/DiscoverSpacesView'
import { ALL_SKILLS, ALL_TOPICS } from '@holi/core/domain/shared/types'
import { DiscoverSpacesDefaultTopicsDocument } from '@holi/api/graphql/graphql-codegen'

jest.mock('@holi/core/auth/hooks/useLoggedInUser', () => ({
  useLoggedInUser: () => ({
    isLoggedIn: true,
  }),
}))

const ScrollBasedRenderMock = ({ children }: PropsWithChildren) => <>{children}</>
jest.mock('@holi/core/components/ScrollBasedRender', () => ScrollBasedRenderMock)

const defaultTopics = ALL_TOPICS.slice(3, 5)

const userTopics: string[] = [defaultTopics[0]]

const userSkills: string[] = ALL_SKILLS.slice(0, 2)

// prevent logging about incomplete apollo mocks,
// because we didn't flesh out the response data
global.console.error = jest.fn()
global.console.warn = jest.fn()

const defaultTopicsMock = {
  request: {
    query: DiscoverSpacesDefaultTopicsDocument,
  },
  result: {
    data: {
      discoverSpacesDefaultTopicsV2: defaultTopics,
    },
  },
}

const renderDiscoverSpaces = (userTopics: string[] = [], userSkills: string[] = [], userGeolocationId?: string) => {
  return renderRouter({
    index: () => (
      <MockedProvider mocks={[defaultTopicsMock]} addTypename={false}>
        <DiscoverSpacesView userSkills={userSkills} userTopics={userTopics} userGeolocationId={userGeolocationId} />
      </MockedProvider>
    ),
  })
}

describe('DiscoverSpacesView', () => {
  it('renders correctly, without user topics, when loading', async () => {
    renderDiscoverSpaces([], [], undefined)

    expect(screen.queryAllByTestId('space-link-loading')).toHaveLength(SPACES_SLIDER_SKELETONS * SPACES_GROUP_LIMIT)

    expect(screen.queryAllByTestId('discover-topics-slider-user-specific')).toHaveLength(0)
    expect(screen.queryAllByTestId('discover-skills-slider-user-specific')).toHaveLength(0)
    expect(screen.queryAllByTestId('discover-topic-slider-others')).toHaveLength(0)
  })

  it('renders correctly, without user topics, when loaded', async () => {
    renderDiscoverSpaces()

    expect(screen.queryAllByTestId('discover-topics-slider-user-specific')).toHaveLength(0)
    expect(screen.queryAllByTestId('discover-skills-slider-user-specific')).toHaveLength(0)

    await waitFor(() =>
      expect(screen.queryAllByTestId('discover-topic-slider-others')).toHaveLength(defaultTopics.length)
    )

    expect(screen.queryAllByTestId('space-link-loading')).toHaveLength(defaultTopics.length * SPACES_GROUP_LIMIT)

    expect(screen.getByText(`topic.${defaultTopics[0]}`)).toBeDefined()
    expect(screen.getByText(`topic.${defaultTopics[1]}`)).toBeDefined()
  })

  it('renders correctly, with user topics, when loading', async () => {
    renderDiscoverSpaces(userTopics, userSkills, undefined)

    expect(screen.queryAllByTestId('space-link-loading')).toHaveLength(
      (userTopics.length + userSkills.length + SPACES_SLIDER_SKELETONS) * SPACES_GROUP_LIMIT
    )

    expect(screen.queryAllByTestId('discover-topics-slider-user-specific')).toHaveLength(1)
    expect(screen.queryAllByTestId('discover-skills-slider-user-specific')).toHaveLength(2)
    expect(screen.queryAllByTestId('discover-topic-slider-others')).toHaveLength(0)
  })

  it('renders correctly, with user topics, when loaded', async () => {
    renderDiscoverSpaces(userTopics, userSkills)

    await waitFor(() =>
      expect(screen.queryAllByTestId('space-link-loading')).toHaveLength(
        (defaultTopics.length + userSkills.length) * SPACES_GROUP_LIMIT
      )
    )

    expect(screen.queryAllByTestId('discover-topics-slider-user-specific')).toHaveLength(1)
    expect(screen.queryAllByTestId('discover-skills-slider-user-specific')).toHaveLength(2)
    expect(screen.queryAllByTestId('discover-topic-slider-others')).toHaveLength(1)
  })

  it('renders correctly, without default spaces, when loaded', async () => {
    renderDiscoverSpaces(defaultTopics, userSkills)

    await waitFor(() =>
      expect(screen.queryAllByTestId('space-link-loading')).toHaveLength(
        (defaultTopics.length + userSkills.length) * SPACES_GROUP_LIMIT
      )
    )

    expect(screen.queryAllByTestId('discover-topics-slider-user-specific')).toHaveLength(2)
    expect(screen.queryAllByTestId('discover-skills-slider-user-specific')).toHaveLength(2)
    expect(screen.queryAllByTestId('discover-topic-slider-others')).toHaveLength(0) // filtered by user topics
  })
})
