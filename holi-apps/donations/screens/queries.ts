import { gql } from '@apollo/client/core'

export const donationAppsProjectsQuery = gql`
  query ($locale: String, $limit: Int, $offset: Int) {
    projects(locale: $locale, limit: $limit, offset: $offset) {
      totalResults
      offset
      projects {
        id
        title
        categories
        donationsCount
        progressPercentage
        openAmountInCents
        picture {
          url
          type
        }
      }
    }
  }
`

export type DonationAppsResponse = {
  projects: Project[]
  totalResults: number
  offset: number
}
