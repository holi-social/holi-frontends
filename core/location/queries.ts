import { gql } from '@apollo/client'

import { Place, PlaceDetails } from '@holi/core/location/typings'

export const geoPlacesQuery = gql`
  query PlacesSuggestions($text: String!, $limit: Int, $level: String) {
    geo_placesAutocomplete(text: $text, limit: $limit, level: $level) {
      id
      name
      city
      coordinates {
        latitude
        longitude
      }
    }
  }
`

export type GeoPlacesResponse = {
  geo_placesAutocomplete: Place[]
}

export const geoPlaceDetailsQuery = gql`
  query PlaceDetails($id: String!) {
    geo_placeDetails(id: $id) {
      boundaries {
        coordinates
      }
      name
    }
  }
`

export type GeoPlaceDetailsResponse = {
  geo_placeDetails: PlaceDetails
}
