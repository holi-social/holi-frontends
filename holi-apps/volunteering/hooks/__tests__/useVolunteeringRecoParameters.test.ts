import { renderHook } from '@testing-library/react-hooks'
import { useUserSpecificRecoParameters } from '@holi-apps/volunteering/hooks/useUserSpecificRecoParameters'
import { useGeolocationDetails } from '@holi/core/geolocation/hooks/useGeolocationDetails'
import { useVolunteeringRecoParameters } from '@holi-apps/volunteering/hooks/useVolunteeringRecoParameters'

const mockUseUserSpecificRecoParameters = jest.mocked(useUserSpecificRecoParameters)
jest.mock('@holi-apps/volunteering/hooks/useUserSpecificRecoParameters', () => ({
  useUserSpecificRecoParameters: jest.fn(),
}))

const mockUseGeolocationDetails = jest.mocked(useGeolocationDetails)
jest.mock('@holi/core/geolocation/hooks/useGeolocationDetails', () => ({
  useGeolocationDetails: jest.fn(),
}))

describe('useVolunteeringRecoParameters', () => {
  beforeEach(() => {
    mockUseGeolocationDetails.mockReturnValue({
      loadingGeolocation: false,
    })
    mockUseUserSpecificRecoParameters.mockReturnValue({
      loading: false,
      topics: ['arts-culture', 'disaster-relief'],
      skills: ['building-handicraft', 'emergency-care'],
    })
  })

  it('passes on loading state of user reco query variables', () => {
    mockUseUserSpecificRecoParameters.mockReturnValue({
      loading: true,
    })

    const { result } = renderHook(() => useVolunteeringRecoParameters())

    expect(result.current.isLoadingParameters).toBeTruthy()
  })

  it('passes on loading state of geolocation', () => {
    mockUseGeolocationDetails.mockReturnValue({
      loadingGeolocation: true,
    })

    const { result } = renderHook(() => useVolunteeringRecoParameters())

    expect(result.current.isLoadingParameters).toBeTruthy()
  })

  it('builds the parameters correctly', () => {
    const { result } = renderHook(() => useVolunteeringRecoParameters())

    expect(result.current.isLoadingParameters).toBeFalsy()
    expect(result.current.parameters).toEqual({
      filter_by: 'type:=[volunteering,task]',
      sort_by: '_vector_distance:asc',
      vector_query:
        'topics_skills_embedding_v2:([0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],k:100,alpha:0.9,distance_threshold:1)',
    })
  })

  it('builds the parameters correctly with geolocation', () => {
    mockUseGeolocationDetails.mockReturnValue({
      loadingGeolocation: false,
      geolocationDetails: {
        geolocation: {
          properties: {
            lat: 1,
            lon: 2,
            formatted: '',
          },
          place_id: '',
          geometry: {
            type: '',
            coordinates: [],
          },
        },
        id: '',
        name: '',
      },
    })
    const { result } = renderHook(() => useVolunteeringRecoParameters())

    expect(result.current.isLoadingParameters).toBeFalsy()
    expect(result.current.parameters).toEqual({
      filter_by: 'type:=[volunteering,task]',
      sort_by: 'location_lat_lng(1, 2):asc,_vector_distance:asc',
      vector_query:
        'topics_skills_embedding_v2:([0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],k:100,alpha:0.9,distance_threshold:1)',
    })
  })

  it('builds the parameters correctly with the given page size', () => {
    const pageSize = 5
    const { result } = renderHook(() => useVolunteeringRecoParameters({ pageSize }))

    expect(result.current.isLoadingParameters).toBeFalsy()
    expect(result.current.parameters).toEqual({
      filter_by: 'type:=[volunteering,task]',
      sort_by: '_vector_distance:asc',
      per_page: 5,
      vector_query:
        'topics_skills_embedding_v2:([0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],k:100,alpha:0.9,distance_threshold:1)',
    })
  })

  it('passes on the geolocation error handler', () => {
    const onGeolocationError = jest.fn()
    // TODO(SF) create correct error
    const error = {
      name: '',
      message: 'Test error',
      graphQLErrors: [],
      protocolErrors: [],
      clientErrors: [],
      networkError: null,
      extraInfo: undefined,
    }
    mockUseGeolocationDetails.mockImplementation((id, onError) => {
      /* eslint-disable  @typescript-eslint/no-explicit-any */
      onError?.(error as any)
      return {
        loadingGeolocation: false,
      }
    })
    renderHook(() => useVolunteeringRecoParameters({ onGeolocationError }))

    expect(onGeolocationError).toHaveBeenCalledWith(error)
  })
})
