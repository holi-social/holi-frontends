import { gql } from '@apollo/client'

import { Place } from '@holi/core/location/typings'

export const geoPlacesQuery = gql`
  query PlacesSuggestions($input: String!) {
    geo_places(input: $input) {
      description
    }
  }
`

export type GeoPlacesResponse = {
  geo_places: Place[]
}
