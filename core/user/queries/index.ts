import { gql } from '@apollo/client/core'

import { User } from '@holi/core/user/types'

// TODO(SF) worked for a while with babel-plugin-import-graphql
// but then i ran into issue https://github.com/detrohutt/babel-plugin-import-graphql/issues/79
// import allUsersQuery from './queries/allUsersQuery.graphql'
// import updateUserMutation from './queries/updateUser.graphql'
// import userQuery from './queries/userQuery.graphql'

export const userFragment = gql`
  fragment FullUser on User {
    id
    name
    aboutMe
    pronouns
    location
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
