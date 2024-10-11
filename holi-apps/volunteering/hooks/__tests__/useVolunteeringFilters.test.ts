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

      expect(result.current.filters).toEqual({})

      act(() => {
        result.current.submit({ topics: ['topic1'] })
      })

      expect(result.current.filters).toEqual({ topics: ['topic1'] })
    })
    it('should update query parameters on submit', () => {
      const { mockUseUpdateParams } = mockParameters({})
      const { result } = renderHook(() => useVolunteeringFilters(onSubmit))

      act(() => {
        result.current.submit({ topics: ['topic1'], location: { id: 'locationId', label: 'Hamburg' } })
      })

      expect(mockUseUpdateParams).toHaveBeenCalledWith({ topic: ['topic1'], geolocationId: 'locationId' })
    })
    it('should call submit callback on submit', () => {
      const { result } = renderHook(() => useVolunteeringFilters(onSubmit))

      expect(onSubmit).not.toHaveBeenCalled()

      act(() => {
        result.current.submit({ topics: ['topic1'] })
      })

      expect(onSubmit).toHaveBeenCalled()
    })
    it('should prefill filters from query parameters', () => {
      mockParameters({ topic: ['topic1'] })
      const { result } = renderHook(() => useVolunteeringFilters(onSubmit))

      expect(result.current.filters).toEqual({ topics: ['topic1'] })
    })
    it('should expose function to clear filters', () => {
      const { mockUseUpdateParams } = mockParameters({ topic: ['topic1'] })
      const { result } = renderHook(() => useVolunteeringFilters(onSubmit))

      expect(result.current.filters).toEqual({ topics: ['topic1'] })

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
