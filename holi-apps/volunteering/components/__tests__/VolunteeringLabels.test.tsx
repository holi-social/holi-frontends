import { faker } from '@faker-js/faker'
import { render, screen } from '@testing-library/react-native'
import React from 'react'

import { useSkills, useTopics } from '@holi/core/domain/shared/hooks'
import { Skill, Topic } from '@holi/core/domain/shared/types'

import { VolunteeringLabels } from '@holi-apps/volunteering/components/VolunteeringLabels'

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
const allTopicsSlugs = allTopics.map((topic) => topic.slug)
const allSkills: Skill[] = [skill1, skill2, skill3]
const allSkillsSlugs = allSkills.map((skill) => skill.slug)

jest.mock('@holi/core/domain/shared/hooks')
const mockUseTopics = jest.mocked(useTopics)
const mockUseSkills = jest.mocked(useSkills)

describe('VolunteeringLabels', () => {
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
  describe('with displayAll=false', () => {
    it('renders no label for topics if none given', () => {
      render(<VolunteeringLabels displayAll={false} topicSlugs={[]} skillSlugs={[]} />)
      allTopics.forEach((topic) => {
        expect(screen.queryByText(topic.title)).toBeFalsy()
      })
    })
    it('renders a label for first topic if given', () => {
      render(<VolunteeringLabels displayAll={false} topicSlugs={[topic1.slug]} skillSlugs={[]} />)
      expect(screen.queryByText(topic1.title)).toBeTruthy()
    })
    it('renders a label "+n" for topics if n+1 topics given', () => {
      render(<VolunteeringLabels displayAll={false} topicSlugs={allTopicsSlugs} skillSlugs={[]} />)
      expect(screen.queryByText(topic1.title)).toBeTruthy()
      expect(screen.queryByText('+2')).toBeTruthy()
    })
    it('renders no label for skills if none given', () => {
      render(<VolunteeringLabels displayAll={false} topicSlugs={[]} skillSlugs={[]} />)
      allSkills.forEach((skill) => {
        expect(screen.queryByText(skill.title)).toBeFalsy()
      })
    })
    it('renders a label for first skill if given', () => {
      render(<VolunteeringLabels displayAll={false} topicSlugs={[]} skillSlugs={[skill1.slug]} />)
      expect(screen.queryByText(skill1.title)).toBeTruthy()
    })
    it('renders a label "+n" for skills if n+1 skills given', () => {
      render(<VolunteeringLabels displayAll={false} topicSlugs={[]} skillSlugs={allSkillsSlugs} />)
      expect(screen.queryByText(skill1.title)).toBeTruthy()
      expect(screen.queryByText('+2')).toBeTruthy()
    })
    it('renders labels if both topics and skills present', () => {
      render(
        <VolunteeringLabels displayAll={false} topicSlugs={[topic1.slug, topic2.slug]} skillSlugs={allSkillsSlugs} />
      )
      expect(screen.queryByText(topic1.title)).toBeTruthy()
      expect(screen.queryByText('+1')).toBeTruthy()
      expect(screen.queryByText(skill1.title)).toBeTruthy()
      expect(screen.queryByText('+2')).toBeTruthy()
    })
  })
  describe('with displayAll=true', () => {
    it('renders no label for topics if none given', () => {
      render(<VolunteeringLabels displayAll={true} topicSlugs={[]} skillSlugs={[]} />)
      allTopics.forEach((topic) => {
        expect(screen.queryByText(topic.title)).toBeFalsy()
      })
    })
    it('renders a label for every given topic', () => {
      render(<VolunteeringLabels displayAll={true} topicSlugs={allTopicsSlugs} skillSlugs={[]} />)
      allTopics.forEach((topic) => {
        expect(screen.queryByText(topic.title)).toBeTruthy()
      })
    })
    it('renders no label for skills if none given', () => {
      render(<VolunteeringLabels displayAll={true} topicSlugs={[]} skillSlugs={[]} />)
      allSkills.forEach((skill) => {
        expect(screen.queryByText(skill.title)).toBeFalsy()
      })
    })
    it('renders a label for every given skill', () => {
      render(<VolunteeringLabels displayAll={true} topicSlugs={[]} skillSlugs={allSkillsSlugs} />)
      allSkills.forEach((skill) => {
        expect(screen.queryByText(skill.title)).toBeTruthy()
      })
    })
    it('renders labels if both topics and skills present', () => {
      render(
        <VolunteeringLabels displayAll={true} topicSlugs={[topic1.slug, topic2.slug]} skillSlugs={allSkillsSlugs} />
      )
      expect(screen.queryByText(topic1.title)).toBeTruthy()
      expect(screen.queryByText(topic2.title)).toBeTruthy()
      expect(screen.queryByText(topic3.title)).toBeFalsy()
      allSkills.forEach((skill) => {
        expect(screen.queryByText(skill.title)).toBeTruthy()
      })
    })
  })
})
