import { gql } from '@apollo/client'

import { FullSpaceMemberFragment, FullSpaceMembershipRequestFragment } from '@holi/core/screens/spaces/queries'
import { FullUserAvatarFragment } from '@holi/core/screens/userprofile/queries'

export const spaceMembersQuery = gql`
  ${FullSpaceMemberFragment}

  query SpaceMembersBySpaceId($idOrName: String!, $offset: Int! = 0, $limit: Int! = 10) {
    spaceById(idOrName: $idOrName) {
      id
      members(limit: $limit, offset: $offset) {
        ...FullSpaceMember
      }
    }
  }
`

export const spaceMembershipRequestsQuery = gql`
  ${FullSpaceMembershipRequestFragment}

  query SpaceMembershipRequestsBySpaceId($idOrName: String!, $offset: Int! = 0, $limit: Int! = 10) {
    spaceById(idOrName: $idOrName) {
      id
      membershipRequests(limit: $limit, offset: $offset) {
        ...FullSpaceMembershipRequest
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
