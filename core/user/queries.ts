import { gql } from '@apollo/client/core'

import { User } from '@holi/core/user/types'

// TODO: user needs also default color (HOLI-1525)
export const userFragment = gql`
  fragment FullUser on User {
    id
    image
    firstName
    middleName
    lastName
    aboutMe
    pronouns
    location
    engagementLevel
    interests
    sdgs
    skills
  }
`

export const allUsersQuery = gql`
  ${userFragment}

  query Users($offset: Int, $limit: Int) {
    allUsers(offset: $offset, limit: $limit) {
      ...FullUser
    }
  }
`

export const updateUserMutation = gql`
  ${userFragment}

  mutation UpdateUser($id: ID!, $user: UserInput) {
    updateUser(id: $id, user: $user) {
      ...FullUser
    }
  }
`

export interface AllUsersQueryResult {
  allUsers: User[]
}
