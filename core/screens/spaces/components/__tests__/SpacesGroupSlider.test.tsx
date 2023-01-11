import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { SpaceTermContext } from '@holi/core/screens/spaces/components/SpaceTermContextProvider'
import SpacesGroupSlider from '@holi/core/screens/spaces/components/SpacesGroupSlider'
import { location, spaces } from '@holi/core/screens/spaces/components/__tests__/testData'
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

const spaceTermContext = {
  loading: false,
  loadingFailed: false,
  topics,
  skills,
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
  location,
  spaces: pagedSpaces,
}

describe('SpacesGroupSlider', () => {
  it('renders correctly', () => {
    const { getByText, getAllByText, getAllByRole } = render(
      <SpaceTermContext.Provider value={spaceTermContext}>
        <SpacesGroupSlider group={groupWithTopicId} />
      </SpaceTermContext.Provider>
    )

    expect(getByText('Topic 1')).toBeDefined()
    expect(getAllByText('Space title').length).toBe(3)

    const images = getAllByRole('image')
    // expect 3 spaces with 2 images each
    expect(images.length).toBe(6)
    const [mainImage, avatarImage] = images
    expect(mainImage).toHaveProp('source', { uri: 'https://www.example.com/space1.jpg' })
    expect(avatarImage).toHaveProp('source', { uri: 'https://www.example.com/avatar.jpg' })
  })

  it('does not display "see more" element if there is nothing more to see', () => {
    const { queryByTestId } = render(
      <SpaceTermContext.Provider value={spaceTermContext}>
        <SpacesGroupSlider group={groupWithTopicId} />
      </SpaceTermContext.Provider>
    )

    expect(queryByTestId('spaces-group-slider-see-more')).toBeFalsy()
  })

  it('navigates to topic filter screen if there is more to see', () => {
    const pagedSpacesSeeMore: Paged<Space> = {
      totalResults: 20, // more than spaces page size
      data: spaces,
    }

    const group: DiscoverSpacesGroup = {
      topicId: '1',
      spaces: pagedSpacesSeeMore,
    }

    const { getByTestId } = render(
      <SpaceTermContext.Provider value={spaceTermContext}>
        <SpacesGroupSlider group={group} />
      </SpaceTermContext.Provider>
    )

    fireEvent.press(getByTestId('spaces-group-slider-see-more'))

    expect(mockNavigate).toHaveBeenCalledWith('/spaces/filter?topic=topic-1')
  })

  it('navigates to topic filter screen if the user clicks the topic pill', () => {
    const { getByTestId } = render(
      <SpaceTermContext.Provider value={spaceTermContext}>
        <SpacesGroupSlider group={groupWithTopicId} />
      </SpaceTermContext.Provider>
    )

    fireEvent.press(getByTestId('spaces-topic-title'))

    expect(mockNavigate).toHaveBeenCalledWith('/spaces/filter?topic=topic-1')
  })

  it('navigates to skill filter screen if the user clicks the skill pill', () => {
    const { getByTestId } = render(
      <SpaceTermContext.Provider value={spaceTermContext}>
        <SpacesGroupSlider group={groupWithSkillId} />
      </SpaceTermContext.Provider>
    )

    fireEvent.press(getByTestId('spaces-skill-title'))

    expect(mockNavigate).toHaveBeenCalledWith('/spaces/filter?skill=skill-1')
  })

  it('navigates to location filter screen if the user clicks the location pill', () => {
    const { getByTestId } = render(
      <SpaceTermContext.Provider value={spaceTermContext}>
        <SpacesGroupSlider group={groupWithLocation} />
      </SpaceTermContext.Provider>
    )

    fireEvent.press(getByTestId('spaces-location-title'))

    expect(mockNavigate).toHaveBeenCalledWith('/spaces/filter?location=TEST_LOCATION')
  })
})
