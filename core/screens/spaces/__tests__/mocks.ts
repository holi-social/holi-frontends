import { authenticatedUserV2Query } from '@holi/core/domain/shared/queries'
import { geoPlaceDetailsQuery } from '@holi/core/geolocation/queries'
import { authenticatedUserV2, locationId } from '@holi/core/screens/spaces/__tests__/testData'
import { mySpaceQuery } from '@holi/core/screens/spaces/discover/queries'
import { DEFAULT_LOCATION_ID } from '@holi/core/screens/spaces/helpers/defaultFilters'

export const authenticatedUserMock = {
  request: {
    query: authenticatedUserV2Query,
    variables: { userId: authenticatedUserV2.id },
  },
  result: {
    data: {
      authenticatedUserV2,
    },
  },
}

export const locationDetailsMock = {
  request: {
    query: geoPlaceDetailsQuery,
    variables: {
      id: locationId,
    },
  },
  result: {
    data: {
      geo_placeDetails: {
        name: 'Hamburg, Germany',
        geolocation: {},
      },
    },
  },
}

export const defaultLocationDetailsMock = {
  request: {
    query: geoPlaceDetailsQuery,
    variables: {
      id: DEFAULT_LOCATION_ID,
    },
  },
  result: {
    data: {
      geo_placeDetails: {
        name: 'Germany',
        geolocation: {},
      },
    },
  },
}

export const mySpacesWithEmptyResultMock = {
  request: {
    query: mySpaceQuery,
    variables: {},
  },
  result: {
    data: {
      mySpaces: [],
    },
  },
}
