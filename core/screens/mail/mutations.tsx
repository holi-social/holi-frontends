import { gql } from '@apollo/client'

export const unsubscribeFromNewsletterMutation = gql`
  mutation UnsubscribeFromNewsletter($token: String!) {
    unsubscribeFromNewsletter(token: $token) {
      success
    }
  }
`
