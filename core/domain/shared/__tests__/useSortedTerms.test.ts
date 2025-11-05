import { ALL_SKILLS, ALL_TOPICS } from '@holi/core/domain/shared/types'
import { useSortedTerms } from '@holi/core/domain/shared/useSortedTerms'
import { renderHook } from '@testing-library/react-native'

describe('useSortedTerms', () => {
  describe('for topics', () => {
    it('should create topics with labels', () => {
      const { result } = renderHook(() => useSortedTerms('topic'))

      expect(result.current[0].term).toEqual('animal-welfare')
      expect(result.current[0].label).toEqual('topic.animal-welfare')
    })

    it('should sort topics by label with "other" at the end', () => {
      const topics = ALL_TOPICS.slice()
      topics.splice(topics.indexOf('other'), 1)
      const expectedOrder = [...topics, 'other']
      const { result } = renderHook(() => useSortedTerms('topic'))

      expect(result.current.map((termWithLabel) => termWithLabel.term)).toEqual(expectedOrder)
    })
  })

  describe('for skills', () => {
    it('should create skills with labels', () => {
      const { result } = renderHook(() => useSortedTerms('skill'))

      expect(result.current[0].term).toEqual('administration')
      expect(result.current[0].label).toEqual('skill.administration')
    })

    it('should sort skills by label with "other" at the end', () => {
      const terms = ALL_SKILLS.slice()
      terms.splice(terms.indexOf('other'), 1)
      const expectedOrder = [...terms, 'other']
      const { result } = renderHook(() => useSortedTerms('skill'))

      expect(result.current.map((termWithLabel) => termWithLabel.term)).toEqual(expectedOrder)
    })
  })
})
