import { gql } from '@apollo/client'

import { Place } from '@holi/core/location/typings'

export const geoPlacesQuery = gql`
  query PlacesSuggestions($text: String!, $limit: Int) {
    geo_placesAutocomplete(text: $text, limit: $limit) {
      id
      name
      city
    }
  }
`

export type GeoPlacesResponse = {
  geo_placesAutocomplete: Place[]
}
