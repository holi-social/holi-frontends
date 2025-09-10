import { gql } from '@apollo/client/core'

import type { Project, ProjectsResponse } from '@holi-apps/donations/typings'

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
      width
      height
    }
    initiative {
      name
    }
  }
`

export const fullProjectFragment = gql`
  fragment FullProject on AppDonations_Project {
    id
    title
    categories
    summary
    description
    donationsCount
    donationUrl
    progressPercentage
    openAmountInCents
    picture {
      type
      url
      width
      height
    }
    initiative {
      id
      name
      city
      country
      picture {
        url
        type
        width
        height
      }
      url
    }
    newsCount
    news(limit: 5) {
      id
      title
      publishDate
      body
      url
      author {
        name
        picture {
          type
          url
          width
          height
        }
      }
    }
  }
`

export const donationProjectsQuery = gql`
  ${projectFragment}

  query Projects($offset: Int = 0, $limit: Int = 10, $location: String) {
    appDonations_projects(offset: $offset, limit: $limit, location: $location) {
      totalResults
      data {
        ...Project
      }
    }
  }
`

export type AppDonationsProjectsResponse = {
  appDonations_projects: ProjectsResponse
}

// TODO(SF) remove all of this
export const donationProjectByIdQuery = gql`
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
