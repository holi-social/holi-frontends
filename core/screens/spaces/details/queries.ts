import { gql } from '@apollo/client'

import { FullSpaceMemberFragment } from '@holi/core/screens/spaces/queries'
import { FullUserAvatarFragment } from '@holi/core/screens/userprofile/queries'

export const spaceMembersQuery = gql`
  ${FullSpaceMemberFragment}

  query SpaceMembersBySpaceId($idOrName: String!, $offset: Int!, $limit: Int!) {
    spaceById(idOrName: $idOrName) {
      id
      members(limit: $limit, offset: $offset) {
        ...FullSpaceMember
      }
    }
  }
`

export const usersByNameWithSpaceConnectionQuery = gql`
  ${FullUserAvatarFragment}

  query UsersByNameWithSpaceConnection($substring: String!, $spaceId: UUID!, $limit: Int!, $offset: Int!) {
    userByName(substring: $substring, limit: $limit, offset: $offset) {
      data {
        ...FullUserAvatar
        connectionStatusToMyself
        connectionStatusToSpace(spaceId: $spaceId)
      }
      totalResults
    }
  }
`
