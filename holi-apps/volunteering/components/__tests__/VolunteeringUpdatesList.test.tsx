import { faker } from '@faker-js/faker'
import { render, screen } from '@testing-library/react-native'
import React from 'react'

import { useSkills, useTopics } from '@holi/core/domain/shared/hooks'
import { Skill, Topic } from '@holi/core/domain/shared/types'

import VolunteeringUpdatesList from '@holi-apps/volunteering/components/VolunteeringUpdatesList'
import { useVolunteeringVariant } from '@holi-apps/volunteering/hooks/useVolunteeringVariant'
import { VolunteeringEngagement } from '@holi-apps/volunteering/types'

const makeEngagement = (topics: Topic[], skills: Skill[], location = true): VolunteeringEngagement => ({
  id: faker.string.uuid(),
  title: faker.lorem.sentence(10),
  description: faker.lorem.paragraph(10),
  url: faker.internet.url(),
  source: faker.lorem.word(),
  categories: [faker.lorem.word()],
  imageUrl: faker.image.url(),
  organizer: {
    name: faker.person.fullName(),
    imageUrl: faker.image.url(),
  },
  location: location ? faker.location.city() : undefined,
  latitude: location ? faker.location.latitude() : undefined,
  longitude: location ? faker.location.longitude() : undefined,
  matchedTopics: topics.map((t) => t.slug),
  matchedSkills: skills.map((s) => s.slug),
})

const topic1: Topic = {
  id: faker.string.uuid(),
  title: 'Topic 1',
  slug: 'topic-1',
  isDiscoverSpacesDefault: false,
}

const topic2: Topic = {
  id: faker.string.uuid(),
  title: 'Topic 2',
  slug: 'topic-2',
  isDiscoverSpacesDefault: false,
}

const topic3: Topic = {
  id: faker.string.uuid(),
  title: 'Topic 3',
  slug: 'topic-3',
  isDiscoverSpacesDefault: false,
}

const skill1: Skill = {
  id: faker.string.uuid(),
  title: 'Skill 1',
  slug: 'skill-1',
}

const skill2: Skill = {
  id: faker.string.uuid(),
  title: 'Skill 2',
  slug: 'skill-2',
}

const skill3: Skill = {
  id: faker.string.uuid(),
  title: 'Skill 3',
  slug: 'skill-3',
}

const allTopics: Topic[] = [topic1, topic2, topic3]
const allSkills: Skill[] = [skill1, skill2, skill3]

jest.mock('@holi-apps/volunteering/hooks/useVolunteeringVariant')
const mockUseVolunteeringVariant = jest.mocked(useVolunteeringVariant)

jest.mock('@holi/core/domain/shared/hooks')
const mockUseTopics = jest.mocked(useTopics)
const mockUseSkills = jest.mocked(useSkills)

describe('VolunteeringUpdatesList', () => {
  beforeEach(() => {
    mockUseTopics.mockReturnValue({
      topics: allTopics,
      topicsLoading: false,
    })
    mockUseSkills.mockReturnValue({
      skills: allSkills,
      skillsLoading: false,
    })
    mockUseVolunteeringVariant.mockReturnValue('recosV1')
  })
  it('renders no location if not given', () => {
    const engagement = makeEngagement([topic1, topic2], [skill1, skill2, skill3], false)
    render(<VolunteeringUpdatesList cardWidth={260} engagements={[engagement]} loading={false} />)
    expect(screen.queryByTestId('volunteering-updates-item-location-icon')).toBeFalsy()
  })
  it('renders location with icon if given', () => {
    const engagement = makeEngagement([topic1, topic2], [skill1, skill2, skill3])
    render(<VolunteeringUpdatesList cardWidth={260} engagements={[engagement]} loading={false} />)
    expect(screen.queryByTestId('volunteering-updates-item-location-icon')).toBeTruthy()
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(screen.queryByText(engagement.location!)).toBeTruthy()
  })
})
