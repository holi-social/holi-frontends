import { mockParameters } from '@holi/core/navigation/hooks/useParam/__mocks__/mockParameters'
import { useSpaceInitialFilters } from '@holi/core/screens/spaces/components/SpaceFilterForm/useSpaceInitialFilters'
import { renderHook } from 'expo-router/testing-library'

jest.mock('@holi/core/navigation/hooks/useParam')

const mockUseGeolocationDetails = jest.fn()
jest.mock('@holi/core/geolocation/hooks/useGeolocationDetails', () => ({
  useGeolocationDetailsWithSuggestion: (geolocationId?: string) => mockUseGeolocationDetails(geolocationId),
}))

describe('useSpaceInitialFilters', () => {
  it('should load filters from query parameters', () => {
    mockParameters({ topic: ['elderly-care'] })
    const { result } = renderHook(() => useSpaceInitialFilters())

    expect(result.current.filters).toEqual({ topicSlugs: ['elderly-care'], skillSlugs: [] })
  })

  it('should migrate topics & skills V1 from query parameters to V2', () => {
    mockParameters({
      topic: ['elderly-people', 'diversity-genderequality'],
      skill: ['conflict-management', 'discipline'],
    })
    const { result } = renderHook(() => useSpaceInitialFilters())

    expect(result.current.filters).toEqual({ topicSlugs: ['elderly-care', 'gender-equality'], skillSlugs: ['other'] })
  })
})
