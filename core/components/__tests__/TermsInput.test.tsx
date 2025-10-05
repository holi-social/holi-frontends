import React from 'react'
import { TermsInput } from '@holi/core/components/TermsInput'
import { render, screen, userEvent } from 'expo-router/testing-library'
import { ALL_SKILLS, ALL_TOPICS, type TermType } from '@holi/core/domain/shared/types'

describe('TermsInput', () => {
  const renderTermsInput = (
    termType: TermType,
    {
      onSelect,
      onSingleSelect,
      selected,
    }: { onSelect?: (items: string[]) => void; onSingleSelect?: (item: string) => void; selected?: string[] } = {}
  ) =>
    render(
      <TermsInput
        title="title"
        description="description"
        searchPlaceholder="search"
        onSelect={onSelect}
        onSingleSelect={onSingleSelect}
        selected={selected ?? []}
        termType={termType}
      />
    )

  describe('for topics', () => {
    it('should display topic and description', () => {
      renderTermsInput('topic')

      expect(screen.getByText('title')).toBeOnTheScreen()
      expect(screen.getByText('description')).toBeOnTheScreen()
    })

    it('should list all topic options if not filtering', () => {
      renderTermsInput('topic')

      ALL_TOPICS.forEach((topic) => expect(screen.getByText(`topic.${topic}`)).toBeOnTheScreen())
    })

    it('should filter topic options', async () => {
      const expectedTopics = ['animal-welfare', 'human-rights', 'mobility-transport']
      const user = userEvent.setup()
      renderTermsInput('topic')

      await user.type(screen.getByLabelText('search'), 'an')

      ALL_TOPICS.forEach((topic) => {
        if (expectedTopics.includes(topic)) {
          expect(screen.getByText(`topic.${topic}`)).toBeOnTheScreen()
        } else {
          expect(screen.queryByText(`topic.${topic}`)).not.toBeOnTheScreen()
        }
      })
    })

    it('calls onSelect with selected topics', async () => {
      const onSelect = jest.fn()
      const user = userEvent.setup()
      renderTermsInput('topic', { onSelect })

      await user.press(screen.getByText('topic.technology-innovation'))

      expect(onSelect).toHaveBeenCalledWith(['technology-innovation'])
    })

    it('calls onSingleSelect with pressed topic', async () => {
      const onSingleSelect = jest.fn()
      const user = userEvent.setup()
      renderTermsInput('topic', { onSingleSelect })

      await user.press(screen.getByText('topic.technology-innovation'))

      expect(onSingleSelect).toHaveBeenCalledWith('technology-innovation')
    })

    it('should consider initially selected topics', async () => {
      const selected = ['democracy-politics', 'family-kids']
      const onSelect = jest.fn()
      const user = userEvent.setup()
      renderTermsInput('topic', { onSelect, selected })

      await user.press(screen.getByText('topic.literacy-education'))

      expect(onSelect).toHaveBeenCalledWith(['democracy-politics', 'family-kids', 'literacy-education'])
    })
  })

  describe('for skills', () => {
    it('should display topic and description', () => {
      renderTermsInput('skill')

      expect(screen.getByText('title')).toBeOnTheScreen()
      expect(screen.getByText('description')).toBeOnTheScreen()
    })

    it('should list all skill options if not filtering', () => {
      renderTermsInput('skill')

      ALL_SKILLS.forEach((skill) => expect(screen.getByText(`skill.${skill}`)).toBeOnTheScreen())
    })

    it('should filter skill options', async () => {
      const expectedSkills = ['animal-care', 'community-organizing']
      const user = userEvent.setup()
      renderTermsInput('skill')

      await user.type(screen.getByLabelText('search'), 'ani')

      ALL_SKILLS.forEach((skill) => {
        if (expectedSkills.includes(skill)) {
          expect(screen.getByText(`skill.${skill}`)).toBeOnTheScreen()
        } else {
          expect(screen.queryByText(`skill.${skill}`)).not.toBeOnTheScreen()
        }
      })
    })

    it('calls onSelect with selected skills', async () => {
      const onSelect = jest.fn()
      const user = userEvent.setup()
      renderTermsInput('skill', { onSelect })

      await user.press(screen.getByText('skill.management-strategy'))

      expect(onSelect).toHaveBeenCalledWith(['management-strategy'])
    })

    it('calls onSingleSelect with pressed skill', async () => {
      const onSingleSelect = jest.fn()
      const user = userEvent.setup()
      renderTermsInput('skill', { onSingleSelect })

      await user.press(screen.getByText('skill.management-strategy'))

      expect(onSingleSelect).toHaveBeenCalledWith('management-strategy')
    })

    it('should consider initially selected skills', async () => {
      const selected = ['animal-care', 'it-technology']
      const onSelect = jest.fn()
      const user = userEvent.setup()
      renderTermsInput('skill', { selected, onSelect })

      await user.press(screen.getByText('skill.music-performance'))

      expect(onSelect).toHaveBeenCalledWith(['animal-care', 'it-technology', 'music-performance'])
    })
  })
})
