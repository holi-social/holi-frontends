import { faker } from '@faker-js/faker'
import { render, screen } from '@testing-library/react-native'
import React from 'react'

import { useSkills, useTopics } from '@holi/core/domain/shared/hooks'
import { Skill, Topic } from '@holi/core/domain/shared/types'

import { VolunteeringRecosSliderCard } from '@holi-apps/volunteering/components/VolunteeringRecosSliderCard'
import { VolunteeringReco } from '@holi-apps/volunteering/types'

const makeReco = (
  topics: Topic[],
  skills: Skill[],
  { location = true, organizer = true }: { location?: boolean; organizer?: boolean } = {}
): VolunteeringReco => ({
  engagement: {
    id: faker.string.uuid(),
    title: faker.lorem.sentence(10),
    description: faker.lorem.paragraph(10),
    url: faker.internet.url(),
    imageUrl: faker.image.url(),
    source: faker.lorem.word(),
    organizer: organizer
      ? {
          name: faker.person.fullName(),
          imageUrl: faker.image.url(),
        }
      : undefined,
    location: location ? faker.location.city() : undefined,
    latitude: location ? faker.location.latitude() : undefined,
    longitude: location ? faker.location.longitude() : undefined,
    topics: topics.map((t) => t.slug),
    skills: skills.map((t) => t.slug),
  },
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

jest.mock('@holi/core/domain/shared/hooks')
const mockUseTopics = jest.mocked(useTopics)
const mockUseSkills = jest.mocked(useSkills)

describe('VolunteeringRecosSliderCard', () => {
  beforeEach(() => {
    mockUseTopics.mockReturnValue({
      topics: allTopics,
      topicsLoading: false,
    })
    mockUseSkills.mockReturnValue({
      skills: allSkills,
      skillsLoading: false,
    })
  })
  it('renders labels', () => {
    // just check base case that labels are rendered at all
    // more specific tests and assertions on labels: see VolunteeringLabels (test)
    const reco = makeReco([topic1, topic2], [skill1, skill2, skill3])
    render(<VolunteeringRecosSliderCard cardWidth={260} item={reco} index={0} />)
    expect(screen.getByText(topic1.title)).toBeTruthy()
    expect(screen.getByText(skill1.title)).toBeTruthy()
  })
  it('renders title with organizer', () => {
    const reco = makeReco([topic1, topic2], [skill1, skill2, skill3], { organizer: true })
    render(<VolunteeringRecosSliderCard cardWidth={260} item={reco} index={0} />)
    expect(screen.getByText('engagement.title')).toBeTruthy()
  })
  it('renders title without organizer', () => {
    const reco = makeReco([topic1, topic2], [skill1, skill2, skill3], { organizer: false })
    render(<VolunteeringRecosSliderCard cardWidth={260} item={reco} index={0} />)
    expect(screen.getByText(reco.engagement.title)).toBeTruthy()
  })
  it('renders image', () => {
    const reco = makeReco([topic1, topic2], [skill1, skill2, skill3], { organizer: false })
    render(<VolunteeringRecosSliderCard cardWidth={260} item={reco} index={0} />)
    const image = screen.getByTestId('volunteering-reco-slider-card-card-image')
    expect(image).toBeTruthy()
    expect(image.props['aria-label']).toBe(reco.engagement.title)
  })
  it('renders no location if not given', () => {
    const reco = makeReco([topic1, topic2], [skill1, skill2, skill3], { location: false })
    render(<VolunteeringRecosSliderCard cardWidth={260} item={reco} index={0} />)
    expect(screen.queryByTestId('volunteering-reco-slider-card-location-icon')).toBeFalsy()
  })
  it('renders location with icon if given', () => {
    const reco = makeReco([topic1, topic2], [skill1, skill2, skill3])
    render(<VolunteeringRecosSliderCard cardWidth={260} item={reco} index={0} />)
    expect(screen.queryByTestId('volunteering-reco-slider-card-location-icon')).toBeTruthy()
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(screen.queryByText(reco.engagement.location!)).toBeTruthy()
  })
})
