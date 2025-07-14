import { act, renderHook } from '@testing-library/react-native'
import type { ApolloError } from '@apollo/client'

import { mockParameters } from '@holi/core/navigation/hooks/useParam/__mocks__/mockParameters'

import { useVolunteeringFilters } from '@holi-apps/volunteering/hooks/useVolunteeringFilters'
import { useGeolocationDetailsWithSuggestion } from '@holi/core/geolocation/hooks/useGeolocationDetails'

const mockConsoleWarn = jest.fn()
global.console.warn = mockConsoleWarn

jest.mock('@holi/core/navigation/hooks/useParam')

const mockUseGeolocationDetailsWithSuggestion = jest.mocked(useGeolocationDetailsWithSuggestion)
jest.mock('@holi/core/geolocation/hooks/useGeolocationDetails', () => ({
  useGeolocationDetailsWithSuggestion: jest.fn(),
}))

describe('useVolunteeringFilters', () => {
  beforeEach(() => {
    mockUseGeolocationDetailsWithSuggestion.mockReturnValue({
      loadingGeolocation: false,
    })
    mockParameters({})
  })
  it('should update filter state on submit', () => {
    const { result } = renderHook(() => useVolunteeringFilters())

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
    const { result } = renderHook(() => useVolunteeringFilters())

    act(() => {
      result.current.submit({ topics: ['elderly-care'], location: { id: 'locationId', label: 'Hamburg' } })
    })

    expect(mockUseUpdateParams).toHaveBeenCalledWith({ topic: ['elderly-care'], geolocationId: 'locationId' })
  })
  it('should prefill filters from query parameters', () => {
    mockParameters({ topic: ['elderly-care'] })
    const { result } = renderHook(() => useVolunteeringFilters())

    expect(result.current.filters).toEqual({ topics: ['elderly-care'], skills: [] })
  })
  it('should migrate topics & skills V1 from query parameters', () => {
    mockParameters({
      topic: ['elderly-people', 'diversity-genderequality'],
      skill: ['conflict-management', 'discipline'],
    })
    const { result } = renderHook(() => useVolunteeringFilters())

    expect(result.current.filters).toEqual({ topics: ['elderly-care', 'gender-equality'], skills: ['other'] })
  })
  it('should expose function to clear filters', () => {
    const { mockUseUpdateParams } = mockParameters({ topic: ['elderly-care'] })
    const { result } = renderHook(() => useVolunteeringFilters())

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
    renderHook(() => useVolunteeringFilters())

    expect(mockUseGeolocationDetailsWithSuggestion).toHaveBeenCalledWith('locationId', expect.any(Function))
  })
  it('should add geolocation selection to filters', () => {
    mockParameters({ geolocationId: 'locationId' })
    const geolocationDetails = {
      id: 'locationId',
      name: 'Hamburg, Germany',
      geolocation: {
        place_id: '',
        properties: {
          formatted: '',
          lat: 0,
          lon: 0,
        },
        geometry: {
          type: '',
          coordinates: [],
        },
      },
    }
    mockUseGeolocationDetailsWithSuggestion.mockReturnValue({
      loadingGeolocation: false,
      geolocationDetails,
      geolocationSuggestion: {
        id: 'locationId',
        label: 'Hamburg, Germany',
      },
    })
    const { result } = renderHook(() => useVolunteeringFilters())

    expect(result.current.filters.location).toEqual({
      id: 'locationId',
      label: 'Hamburg, Germany',
    })
  })
  it('should expose geolocation loading state', () => {
    mockParameters({ geolocationId: 'locationId' })
    mockUseGeolocationDetailsWithSuggestion.mockReturnValue({
      loadingGeolocation: true,
    })
    const { result } = renderHook(() => useVolunteeringFilters())

    expect(result.current.loadingGeolocation).toBeTruthy()
  })
  it('should expose geolocation error', () => {
    const testError = new Error('Test') as ApolloError
    mockParameters({ geolocationId: 'locationId' })
    mockUseGeolocationDetailsWithSuggestion.mockReturnValue({
      loadingGeolocation: false,
      geolocationError: testError,
    })
    const { result } = renderHook(() => useVolunteeringFilters())

    expect(result.current.geolocationError).toEqual(testError)
  })
  it('should expose flag if filtering', () => {
    const { result } = renderHook(() => useVolunteeringFilters())

    expect(result.current.isFiltering).toBeFalsy()

    act(() => {
      result.current.submit({ topics: ['topic1'] })
    })

    expect(result.current.isFiltering).toBeTruthy()
  })

  it('should correctly prefill commitment durations', () => {
    mockParameters({ duration: ['HOURS_1to2'] })
    const { result } = renderHook(() => useVolunteeringFilters())

    expect(result.current.filters).toEqual({
      topics: [],
      skills: [],
      commitmentDurations: ['HOURS_1to2'],
    })
  })

  it('should correctly prefill commitment labels', () => {
    mockParameters({ commitment: ['one-time'] })
    const { result } = renderHook(() => useVolunteeringFilters())

    expect(result.current.filters).toEqual({
      topics: [],
      skills: [],
      commitmentLabels: ['one-time'],
    })
  })
})
