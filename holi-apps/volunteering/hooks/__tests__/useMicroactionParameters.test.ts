import { renderHook } from '@testing-library/react-hooks'
import { useMicroactionParameters } from '@holi-apps/volunteering/hooks/useMicroactionParameters'
import { MICROACTION_PAGE_SIZE } from '@holi-apps/volunteering/hooks/useMicroactions'

describe('useMicroactionParameters', () => {
  it('builds the parameters correctly without geolocation', () => {
    const { result } = renderHook(() => useMicroactionParameters(MICROACTION_PAGE_SIZE))

    expect(result.current.parameters).toEqual({
      filter_by:
        'type:=[volunteering,task] && commitment_duration:=[MINUTES_10to15,MINUTES_15to30,MINUTES_30to60] && location_type:=[remote]',
      sort_by: '_rand():desc',
      per_page: MICROACTION_PAGE_SIZE,
    })
  })

  it('builds the parameters correctly with geolocation', () => {
    const mockedGeolocationDetails = {
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
    }

    const { result } = renderHook(() =>
      useMicroactionParameters(MICROACTION_PAGE_SIZE, mockedGeolocationDetails.geolocationDetails)
    )

    expect(result.current.parameters).toEqual({
      filter_by:
        'type:=[volunteering,task] && commitment_duration:=[MINUTES_10to15,MINUTES_15to30,MINUTES_30to60] && (location_lat_lng:(1,2,30 km) || location_type:=[remote])',
      sort_by: '_rand():desc',
      per_page: MICROACTION_PAGE_SIZE,
    })
  })
})
