import { gql } from '@apollo/client/core'

import { ProjectsResponse } from '@holi-apps/donations/typings'

export const projectFragment = gql`
  fragment FullProject on AppDonations_Project {
    id
    title
    categories
    donationsCount
    progressPercentage
    openAmountInCents
    picture {
      type
      url
    }
  }
`

export const projectsQuery = gql`
  ${projectFragment}

  query Projects($locale: String, $limit: Int, $offset: Int) {
    appDonations_projects(locale: $locale, limit: $limit, offset: $offset) {
      totalResults
      offset
      projects {
        ...FullProject
      }
    }
  }
`

export type AppDonationsProjectsResponse = {
  appDonations_projects: ProjectsResponse
}
