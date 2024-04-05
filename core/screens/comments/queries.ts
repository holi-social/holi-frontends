import { gql } from '@apollo/client/core'

export const LinkFragment = gql`
  fragment LinkFragment on LinkPreview {
    requestedUrl
    url
    title
    description
    type
    image
    siteName
    origin
    icon
  }
`
