import { MockedProvider } from '@apollo/client/testing'
import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { locationDetailsMock } from '@holi/core/screens/spaces/__tests__/mocks'
import { locationId, spaces } from '@holi/core/screens/spaces/__tests__/testData'
import SpacesGroupSlider from '@holi/core/screens/spaces/discover/components/SpacesGroupSlider'
import { SpaceTermContext, SpaceTermContextResult } from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import { DiscoverSpacesGroup } from '@holi/core/screens/spaces/queries'
import { Space } from '@holi/core/screens/spaces/types'
import { Skill, Topic } from '@holi/core/screens/userprofile/types'
import { Paged } from '@holi/core/types'

const pagedSpaces: Paged<Space> = {
  totalResults: 10,
  data: spaces,
}

const topics: Topic[] = [
  { id: '1', title: 'Topic 1', slug: 'topic-1', isDiscoverSpacesDefault: false },
  { id: '2', title: 'Topic 2', slug: 'topic-2', isDiscoverSpacesDefault: false },
]

const skills: Skill[] = [
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
  topics,
  skills,
  sdgs: [],
}

const groupWithTopicId: DiscoverSpacesGroup = {
  topicId: '1',
  spaces: pagedSpaces,
}

const groupWithSkillId: DiscoverSpacesGroup = {
  skillId: '1',
  spaces: pagedSpaces,
}

const groupWithLocation: DiscoverSpacesGroup = {
  locationId,
  spaces: pagedSpaces,
}

describe('SpacesGroupSlider', () => {
  const renderGroup = (group: DiscoverSpacesGroup) =>
    render(
      <MockedProvider mocks={[locationDetailsMock]} addTypename={false}>
        <SpaceTermContext.Provider value={spaceTermContext}>
          <SpacesGroupSlider group={group} />
        </SpaceTermContext.Provider>
      </MockedProvider>
    )

  it('renders correctly', () => {
    const { getByText, getAllByText, getAllByRole } = renderGroup(groupWithTopicId)

    expect(getByText('Topic 1')).toBeDefined()
    expect(getAllByText('Space title').length).toBe(3)

    const images = getAllByRole('image')
    // expect 3 spaces with 2 images each
    expect(images.length).toBe(6)
    // TODO: expo-image - enable after fixing
    // const [coverImage, avatarImage] = images
    // expect(coverImage.props.proxiedProperties.source).toEqual([{ uri: 'https://www.example.com/space1.jpg' }])
    // expect(avatarImage.props.proxiedProperties.source).toEqual([
    //   {
    //     uri: 'https://www.example.com/avatar.jpg?tr=w-48',
    //     width: 24,
    //   },
    // ])
  })

  it('does not display "see more" element if there is nothing more to see', () => {
    const { queryByTestId } = renderGroup(groupWithTopicId)

    expect(queryByTestId('spaces-group-slider-see-more')).toBeFalsy()
  })

  it('navigates to topic filter screen if there is more to see', async () => {
    const pagedSpacesSeeMore: Paged<Space> = {
      totalResults: 20, // more than spaces page size
      data: spaces,
    }

    const group: DiscoverSpacesGroup = {
      topicId: '1',
      spaces: pagedSpacesSeeMore,
    }

    const { getByTestId } = renderGroup(group)

    await fireEvent.press(getByTestId('spaces-group-slider-see-more'))

    expect(mockNavigate).toHaveBeenCalledWith('/spaces/filter?topic=topic-1')
  })

  it('navigates to topic filter screen if the user clicks the topic pill', async () => {
    const { getByTestId } = renderGroup(groupWithTopicId)

    await fireEvent.press(getByTestId('spaces-topic-title'))

    expect(mockNavigate).toHaveBeenCalledWith('/spaces/filter?topic=topic-1')
  })

  it('navigates to skill filter screen if the user clicks the skill pill', async () => {
    const { getByTestId } = renderGroup(groupWithSkillId)

    await fireEvent.press(getByTestId('spaces-skill-title'))

    expect(mockNavigate).toHaveBeenCalledWith('/spaces/filter?skill=skill-1')
  })

  it('navigates to location filter screen if the user clicks the location pill', async () => {
    const { findByTestId } = renderGroup(groupWithLocation)

    fireEvent.press(await findByTestId('spaces-location-title'))

    expect(mockNavigate).toHaveBeenCalledWith('/spaces/filter?location=123')
  })
})
