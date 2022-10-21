import { gql } from '@apollo/client/core'

import { Place, Project, ProjectsResponse } from '@holi-apps/donations/typings'

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
  }
`

export const projectsQuery = gql`
  ${projectFragment}

  query Projects($offset: Int, $limit: Int, $locale: String, $location: String) {
    appDonations_projects(offset: $offset, limit: $limit, locale: $locale, location: $location) {
      totalResults
      projects {
        ...Project
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

export const placesQuery = gql`
  query PlacesSuggestions($input: String!) {
    appDonations_places(input: $input) {
      description
      mainText
      mainTextMatchedSubstrings {
        length
        offset
      }
      secondaryText
    }
  }
`

export type AppDonationsPlacesResponse = {
  appDonations_places: Place[]
}
