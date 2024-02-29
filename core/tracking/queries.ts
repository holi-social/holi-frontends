import { gql } from '@apollo/client/core'

export const trackEventMutation = gql`
  mutation TrackEvent($data: String!) {
    trackingEndpoint_trackEvent(data: $data)
  }
`
