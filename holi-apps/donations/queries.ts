import { gql } from '@apollo/client/core'

import { Project, ProjectsResponse } from '@holi-apps/donations/typings'

export const fullProjectFragment = gql`
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
    carrier {
      id
      name
      city
      country
      picture {
        url
        type
      }
      url
    }
  }
`

export const projectsQuery = gql`
  ${fullProjectFragment}

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

export const projectByIdQuery = gql`
  ${fullProjectFragment}

  query ProjectById($id: Int!) {
    appDonations_project(id: $id) {
      ...FullProject
    }
  }
`

export type AppDonationsProjectByIdResponse = {
  appDonations_project: Project
}
