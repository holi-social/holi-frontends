import { act, renderHook } from '@testing-library/react-native'

import { mockParameters } from '@holi/core/navigation/hooks/useParam/__mocks__/mockParameters'

import { useVolunteeringFilters } from '@holi-apps/volunteering/hooks/useVolunteeringFilters'

const mockConsoleWarn = jest.fn()
global.console.warn = mockConsoleWarn

jest.mock('@holi/core/navigation/hooks/useParam')

const mockUseGeolocationDetails = jest.fn()
jest.mock('@holi/core/geolocation/hooks/useGeolocationDetails', () => ({
  useGeolocationDetails: (geolocationId?: string) => mockUseGeolocationDetails(geolocationId),
}))

describe('useVolunteeringFilters', () => {
  const onSubmit = jest.fn()

  describe('DiscoveryV1 filters', () => {
    beforeEach(() => {
      mockUseGeolocationDetails.mockReturnValue({})
      mockParameters({})
    })
    it('should update filter state on submit', () => {
      const { result } = renderHook(() => useVolunteeringFilters(onSubmit))

      expect(result.current.filters).toEqual({
        topics: [],
        skills: [],
      })

      act(() => {
        result.current.submit({ topics: ['elderly-care'], skills: [] })
      })

      expect(result.current.filters).toEqual({ topics: ['elderly-care'], skills: [] })
    })
    it('should update query parameters on submit', () => {
      const { mockUseUpdateParams } = mockParameters({})
      const { result } = renderHook(() => useVolunteeringFilters(onSubmit))

      act(() => {
        result.current.submit({ topics: ['elderly-care'], location: { id: 'locationId', label: 'Hamburg' } })
      })

      expect(mockUseUpdateParams).toHaveBeenCalledWith({ topic: ['elderly-care'], geolocationId: 'locationId' })
    })
    it('should call submit callback on submit', () => {
      const { result } = renderHook(() => useVolunteeringFilters(onSubmit))

      expect(onSubmit).not.toHaveBeenCalled()

      act(() => {
        result.current.submit({ topics: ['elderly-care'] })
      })

      expect(onSubmit).toHaveBeenCalled()
    })
    it('should prefill filters from query parameters', () => {
      mockParameters({ topic: ['elderly-care'] })
      const { result } = renderHook(() => useVolunteeringFilters(onSubmit))

      expect(result.current.filters).toEqual({ topics: ['elderly-care'], skills: [] })
    })
    it('should migrate topics & skills V1 from query parameters', () => {
      mockParameters({
        topic: ['elderly-people', 'diversity-genderequality'],
        skill: ['conflict-management', 'discipline'],
      })
      const { result } = renderHook(() => useVolunteeringFilters(onSubmit))

      expect(result.current.filters).toEqual({ topics: ['elderly-care', 'gender-equality'], skills: ['other'] })
    })
    it('should expose function to clear filters', () => {
      const { mockUseUpdateParams } = mockParameters({ topic: ['elderly-care'] })
      const { result } = renderHook(() => useVolunteeringFilters(onSubmit))

      expect(result.current.filters).toEqual({ topics: ['elderly-care'], skills: [] })

      act(() => {
        result.current.clearFilters()
      })

      expect(result.current.filters).toEqual({})
      expect(mockUseUpdateParams).toHaveBeenCalledWith({
        topic: undefined,
        skill: undefined,
        geolocationId: undefined,
      })
    })
    it('should fetch geolocation if location id is given', () => {
      mockParameters({ geolocationId: 'locationId' })
      renderHook(() => useVolunteeringFilters(onSubmit))

      expect(mockUseGeolocationDetails).toHaveBeenCalledWith('locationId')
    })
    it('should add geolocation selection to filters', () => {
      mockParameters({ geolocationId: 'locationId' })
      mockUseGeolocationDetails.mockReturnValue({
        geolocationDetails: {
          id: 'locationId',
          name: 'Hamburg, Germany',
        },
      })
      const { result } = renderHook(() => useVolunteeringFilters(onSubmit))

      expect(result.current.filters.location).toEqual({
        id: 'locationId',
        name: 'Hamburg, Germany',
        label: 'Hamburg, Germany',
      })
    })
    it('should expose geolocation loading state', () => {
      mockParameters({ geolocationId: 'locationId' })
      mockUseGeolocationDetails.mockReturnValue({
        loadingGeolocation: true,
      })
      const { result } = renderHook(() => useVolunteeringFilters(onSubmit))

      expect(result.current.loadingGeolocation).toBeTruthy()
    })
    it('should expose geolocation loading state if location id is given but no details were fetched yet', () => {
      mockParameters({ geolocationId: 'locationId' })
      const { result } = renderHook(() => useVolunteeringFilters(onSubmit))

      expect(result.current.loadingGeolocation).toBeTruthy()
    })
    it('should expose geolocation error', () => {
      const testError = new Error('Test')
      mockParameters({ geolocationId: 'locationId' })
      mockUseGeolocationDetails.mockReturnValue({
        geolocationError: testError,
      })
      const { result } = renderHook(() => useVolunteeringFilters(onSubmit))

      expect(result.current.geolocationError).toEqual(testError)
    })
    it('should expose flag if filtering', () => {
      const { result } = renderHook(() => useVolunteeringFilters(onSubmit))

      expect(result.current.isFiltering).toBeFalsy()

      act(() => {
        result.current.submit({ topics: ['topic1'] })
      })

      expect(result.current.isFiltering).toBeTruthy()
    })
  })
})
