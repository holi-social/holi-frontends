import { render, screen } from '@testing-library/react-native'
import React from 'react'

import { VolunteeringLabels } from '@holi-apps/volunteering/components/VolunteeringLabels'
import { ALL_SKILLS, ALL_TOPICS } from '@holi/core/domain/shared/types'

describe('VolunteeringLabels', () => {
  describe('with displayAll=false', () => {
    it('renders no label for topics if none given', () => {
      render(<VolunteeringLabels displayAll={false} topicSlugs={[]} skillSlugs={[]} />)
      ALL_TOPICS.forEach((topic) => {
        expect(screen.queryByText(`topic.${topic}`)).toBeFalsy()
      })
    })
    it('renders a label for first topic if given', () => {
      const topic = ALL_TOPICS[0]
      render(<VolunteeringLabels displayAll={false} topicSlugs={[topic]} skillSlugs={[]} />)
      expect(screen.queryByText(`topic.${topic}`)).toBeTruthy()
    })
    it('renders a label "+n" for topics if n+1 topics given', () => {
      const allTopics = ALL_TOPICS.slice(0, 3)
      const firstTopic = allTopics[0]
      render(<VolunteeringLabels displayAll={false} topicSlugs={allTopics} skillSlugs={[]} />)
      expect(screen.queryByText(`topic.${firstTopic}`)).toBeTruthy()
      expect(screen.queryByText('+2')).toBeTruthy()
    })
    it('renders no label for skills if none given', () => {
      render(<VolunteeringLabels displayAll={false} topicSlugs={[]} skillSlugs={[]} />)
      ALL_SKILLS.forEach((skill) => {
        expect(screen.queryByText(`skill.${skill}`)).toBeFalsy()
      })
    })
    it('renders a label for first skill if given', () => {
      const skill = ALL_SKILLS[0]
      render(<VolunteeringLabels displayAll={false} topicSlugs={[]} skillSlugs={[skill]} />)
      expect(screen.queryByText(`skill.${skill}`)).toBeTruthy()
    })
    it('renders a label "+n" for skills if n+1 skills given', () => {
      const allSkills = ALL_SKILLS.slice(0, 3)
      const firstSkill = allSkills[0]
      render(<VolunteeringLabels displayAll={false} topicSlugs={[]} skillSlugs={allSkills} />)
      expect(screen.queryByText(`skill.${firstSkill}`)).toBeTruthy()
      expect(screen.queryByText('+2')).toBeTruthy()
    })
    it('renders labels if both topics and skills present', () => {
      const allTopics = ALL_TOPICS.slice(0, 2)
      const allSkills = ALL_SKILLS.slice(0, 3)
      render(<VolunteeringLabels displayAll={false} topicSlugs={allTopics} skillSlugs={allSkills} />)
      expect(screen.queryByText(`topic.${allTopics[0]}`)).toBeTruthy()
      expect(screen.queryByText('+1')).toBeTruthy()
      expect(screen.queryByText(`skill.${allSkills[0]}`)).toBeTruthy()
      expect(screen.queryByText('+2')).toBeTruthy()
    })
  })
})
