import { gql } from '@apollo/client/core'

export const unsubscribeFromNewsletterMutation = gql`
  mutation UnsubscribeFromNewsletter($token: String!) {
    unsubscribeFromNewsletter(token: $token) {
      success
    }
  }
`
