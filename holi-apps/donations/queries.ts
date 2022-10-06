import { gql } from '@apollo/client/core'

import { Project } from '@holi-apps/donations/typings'

export const projectFragment = gql`
  fragment Project on AppDonations_Project {
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
    initiative {
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
  ${projectFragment}

  query Projects($offset: Int, $limit: Int, $locale: String) {
    appDonations_projects(offset: $offset, limit: $limit, locale: $locale) {
      ...Project
    }
  }
`

export type AppDonationsProjectsResponse = {
  appDonations_projects: Project[]
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
