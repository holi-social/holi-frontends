import { MockedProvider } from '@apollo/client/testing'
import { fireEvent, render } from '@testing-library/react-native'
import React, { PropsWithChildren } from 'react'

import DiscoverSpacesView, {
  SPACES_GROUP_LIMIT,
  SPACES_SLIDER_SKELETONS,
} from '@holi/core/screens/spaces/discover/components/DiscoverSpacesView'
import { SpaceTermContext, SpaceTermContextResult } from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import { Skill, Topic } from '@holi/core/screens/userprofile/types'

jest.mock('@holi/core/screens/userprofile/useLoggedInUser', () => ({
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
    const { getByTestId, queryAllByTestId } = renderDiscoverSpaces([], [], undefined, { topics: [] })

    expect(getByTestId('discover-spaces-header')).toHaveTextContent('spaces.discover.welcome')
    expect(getByTestId('discover-spaces-description')).toHaveTextContent('spaces.discover.description')

    expect(getByTestId('discover-spaces-create-button')).toBeDefined()
    fireEvent.press(getByTestId('discover-spaces-create-button'))
    expect(mockNavigate).toHaveBeenCalledWith('/spaces/create')

    expect(queryAllByTestId('space-link-loading')).toHaveLength(SPACES_SLIDER_SKELETONS * SPACES_GROUP_LIMIT)

    expect(queryAllByTestId('discover-topics-slider-user-specific')).toHaveLength(0)
    expect(queryAllByTestId('discover-skills-slider-user-specific')).toHaveLength(0)
    expect(queryAllByTestId('discover-spaces-others')).toHaveLength(0)
    expect(queryAllByTestId('discover-topic-slider-others')).toHaveLength(0)
  })

  it('renders correctly, without user spaces, when loaded', async () => {
    const { getByTestId, queryAllByTestId, getByText } = renderDiscoverSpaces()

    expect(getByTestId('discover-spaces-header')).toHaveTextContent('spaces.discover.welcome')
    expect(getByTestId('discover-spaces-description')).toHaveTextContent('spaces.discover.description')

    expect(getByTestId('discover-spaces-create-button')).toBeDefined()
    fireEvent.press(getByTestId('discover-spaces-create-button'))
    expect(mockNavigate).toHaveBeenCalledWith('/spaces/create')

    expect(queryAllByTestId('discover-topics-slider-user-specific')).toHaveLength(0)
    expect(queryAllByTestId('discover-skills-slider-user-specific')).toHaveLength(0)
    expect(queryAllByTestId('discover-spaces-others')).toHaveLength(0)

    expect(queryAllByTestId('discover-topic-slider-others')).toHaveLength(defaultTopics.length)
    expect(queryAllByTestId('space-link-loading')).toHaveLength(defaultTopics.length * SPACES_GROUP_LIMIT)

    expect(getByText('Topic 1')).toBeDefined()
    expect(getByText('Topic 2')).toBeDefined()
  })

  it('renders correctly, with user spaces, when loading', async () => {
    const { getByTestId, queryAllByTestId } = renderDiscoverSpaces(userTopics, userSkills, undefined, {
      topics: [],
    })

    expect(getByTestId('discover-spaces-header')).toHaveTextContent('spaces.discover.welcome')
    expect(getByTestId('discover-spaces-description')).toHaveTextContent('spaces.discover.description')

    expect(getByTestId('discover-spaces-create-button')).toBeDefined()
    fireEvent.press(getByTestId('discover-spaces-create-button'))
    expect(mockNavigate).toHaveBeenCalledWith('/spaces/create')

    expect(queryAllByTestId('space-link-loading')).toHaveLength(
      (userTopics.length + userSkills.length + SPACES_SLIDER_SKELETONS) * SPACES_GROUP_LIMIT
    )

    expect(queryAllByTestId('discover-topics-slider-user-specific')).toHaveLength(1)
    expect(queryAllByTestId('discover-skills-slider-user-specific')).toHaveLength(2)
    expect(queryAllByTestId('discover-spaces-others')).toHaveLength(0) // needs default topics loaded
    expect(queryAllByTestId('discover-topic-slider-others')).toHaveLength(0)
  })

  it('renders correctly, with user spaces, when loaded', async () => {
    const { getByTestId, queryAllByTestId } = renderDiscoverSpaces(userTopics, userSkills)

    expect(getByTestId('discover-spaces-header')).toHaveTextContent('spaces.discover.welcome')
    expect(getByTestId('discover-spaces-description')).toHaveTextContent('spaces.discover.description')

    expect(getByTestId('discover-spaces-create-button')).toBeDefined()
    fireEvent.press(getByTestId('discover-spaces-create-button'))
    expect(mockNavigate).toHaveBeenCalledWith('/spaces/create')

    expect(queryAllByTestId('space-link-loading')).toHaveLength(
      (defaultTopics.length + userSkills.length) * SPACES_GROUP_LIMIT
    )

    expect(queryAllByTestId('discover-topics-slider-user-specific')).toHaveLength(1)
    expect(queryAllByTestId('discover-skills-slider-user-specific')).toHaveLength(2)
    expect(getByTestId('discover-spaces-others')).toHaveTextContent('spaces.discover.others')
    expect(queryAllByTestId('discover-topic-slider-others')).toHaveLength(1)
  })

  it('renders correctly, without default spaces, when loaded', async () => {
    const { queryAllByTestId } = renderDiscoverSpaces(defaultTopics, userSkills)

    expect(queryAllByTestId('discover-topics-slider-user-specific')).toHaveLength(2)
    expect(queryAllByTestId('discover-skills-slider-user-specific')).toHaveLength(2)
    expect(queryAllByTestId('discover-spaces-others')).toHaveLength(0) // not needed
    expect(queryAllByTestId('discover-topic-slider-others')).toHaveLength(0) // filtered by user topics
  })
})
