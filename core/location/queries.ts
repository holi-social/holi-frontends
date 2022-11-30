import { gql } from '@apollo/client'

import { Place } from '@holi/core/location/typings'

export const placesQuery = gql`
  query PlacesSuggestions($input: String!) {
    appDonations_places(input: $input) {
      description
    }
  }
`

export type AppDonationsPlacesResponse = {
  appDonations_places: Place[]
}
