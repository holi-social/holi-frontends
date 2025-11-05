import { sortedFilterOptions } from '@holi-apps/volunteering/helpers/filterFacetData'
import { useVolunteeringFilterOptions } from '@holi-apps/volunteering/hooks/useVolunteeringFilterOptions'
import { useSortedTerms } from '@holi/core/domain/shared/useSortedTerms'
import { renderHook } from '@testing-library/react-native'

const mockUseSortedTerms = jest.mocked(useSortedTerms)
jest.mock('@holi/core/domain/shared/useSortedTerms', () => ({
  useSortedTerms: jest.fn(),
}))

const createMockedTerms = (termType: string) =>
  Array.from({ length: 5 }, (_, index) => ({
    term: `${termType}-${index}`,
    label: `${termType} ${index}`,
  }))

describe('useVolunteeringFilterOptions', () => {
  beforeEach(() => {
    mockUseSortedTerms.mockImplementation(createMockedTerms)
  })

  describe('without facet counts', () => {
    it('should return sorted terms for topics', () => {
      const expectedOptions = createMockedTerms('topic')

      const { result } = renderHook(() => useVolunteeringFilterOptions('topics'))

      expect(result.current).toEqual(expectedOptions)
    })

    it('should return sorted terms for skills', () => {
      const expectedOptions = createMockedTerms('skill')

      const { result } = renderHook(() => useVolunteeringFilterOptions('skills'))

      expect(result.current).toEqual(expectedOptions)
    })

    it('should return correct options for commitment labels', () => {
      const expectedOptions = sortedFilterOptions.commitmentLabels.map((term) => ({
        term,
        label: `volunteering.engagement.commitment_label.${term}`,
      }))

      const { result } = renderHook(() => useVolunteeringFilterOptions('commitmentLabels'))

      expect(result.current).toEqual(expectedOptions)
    })

    it('should return correct options for commitment durations', () => {
      const expectedOptions = sortedFilterOptions.commitmentDurations.map((term) => ({
        term,
        label: `volunteering.engagement.commitment_duration.${term}`,
      }))

      const { result } = renderHook(() => useVolunteeringFilterOptions('commitmentDurations'))

      expect(result.current).toEqual(expectedOptions)
    })
  })

  describe('with facet counts', () => {
    const createMockedFacetCounts = (termType: string, facet: string) => ({
      [facet]: Object.fromEntries(Array.from({ length: 5 }, (_, index) => [`${termType}-${index}`, index * 2])),
    })

    const createMockedTermsWithCounts = (termType: string) =>
      Array.from({ length: 5 }, (_, index) => ({
        term: `${termType}-${index}`,
        label: `${termType} ${index}`,
        counter: index * 2,
      }))

    it('should return sorted terms for topics', () => {
      const expectedOptions = createMockedTermsWithCounts('topic')
      const facetCounts = createMockedFacetCounts('topic', 'topics_v2')

      const { result } = renderHook(() => useVolunteeringFilterOptions('topics', facetCounts))

      expect(result.current).toEqual(expectedOptions)
    })

    it('should return sorted terms for skills', () => {
      const expectedOptions = createMockedTermsWithCounts('skill')
      const facetCounts = createMockedFacetCounts('skill', 'skills_v2')

      const { result } = renderHook(() => useVolunteeringFilterOptions('skills', facetCounts))

      expect(result.current).toEqual(expectedOptions)
    })

    it('should return correct options for commitment labels', () => {
      const expectedOptions = sortedFilterOptions.commitmentLabels.map((term, index) => ({
        term,
        label: `volunteering.engagement.commitment_label.${term}`,
        counter: index * 2,
      }))
      const facetCounts = {
        commitment_label: Object.fromEntries(
          sortedFilterOptions.commitmentLabels.map((term, index) => [term, index * 2])
        ),
      }

      createMockedFacetCounts('commitmentLabels', 'commitment_label')

      const { result } = renderHook(() => useVolunteeringFilterOptions('commitmentLabels', facetCounts))

      expect(result.current).toEqual(expectedOptions)
    })

    it('should return correct options for commitment durations', () => {
      const expectedOptions = sortedFilterOptions.commitmentDurations.map((term, index) => ({
        term,
        label: `volunteering.engagement.commitment_duration.${term}`,
        counter: index * 2,
      }))
      const facetCounts = {
        commitment_duration: Object.fromEntries(
          sortedFilterOptions.commitmentDurations.map((term, index) => [term, index * 2])
        ),
      }

      const { result } = renderHook(() => useVolunteeringFilterOptions('commitmentDurations', facetCounts))

      expect(result.current).toEqual(expectedOptions)
    })
  })
})
