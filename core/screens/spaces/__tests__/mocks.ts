import { geoPlaceDetailsQuery } from '@holi/core/location/queries'
import { authenticatedUser, locationId, topics } from '@holi/core/screens/spaces/__tests__/testData'
import { mySpaceQuery } from '@holi/core/screens/spaces/discover/queries'
import { DEFAULT_LOCATION_ID } from '@holi/core/screens/spaces/helpers/defaultFilters'
import { sdgsQuery, topicsQuery } from '@holi/core/screens/spaces/queries'
import { authenticatedUserQuery, skillsQuery } from '@holi/core/screens/userprofile/queries'

export const authenticatedUserMock = {
  request: {
    query: authenticatedUserQuery,
    variables: {},
  },
  result: {
    data: {
      authenticatedUser,
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

export const topicsMock = {
  request: {
    query: topicsQuery,
  },
  result: {
    data: {
      topics: {
        totalResults: topics.length,
        data: topics,
      },
    },
  },
}
export const skillsMock = {
  request: {
    query: skillsQuery,
  },
  result: {
    data: {
      skills: {
        totalResults: [],
        data: [],
      },
    },
  },
}
export const sdgsMock = {
  request: {
    query: sdgsQuery,
  },
  result: {
    data: {
      sdgs: {
        totalResults: [],
        data: [],
      },
    },
  },
}
