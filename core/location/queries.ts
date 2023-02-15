import { gql } from '@apollo/client'

import { Place } from '@holi/core/location/typings'

export const geoPlacesQuery = gql`
  query PlacesSuggestions($text: String!, $limit: Int, $language: String) {
    geo_places(text: $text, limit: $limit, language: $language) {
      id
      name
      city
    }
  }
`

export type GeoPlacesResponse = {
  geo_places: Place[]
}
