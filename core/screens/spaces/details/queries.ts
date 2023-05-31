import { gql } from '@apollo/client'

import { SpaceMemberFragment } from '@holi/core/screens/spaces/queries'

export const spaceMembersQuery = gql`
  ${SpaceMemberFragment}

  query SpaceMembersBySpaceId($idOrName: String!, $offset: Int!, $limit: Int!) {
    spaceById(idOrName: $idOrName) {
      id
      members(limit: $limit, offset: $offset) {
        ...FullSpaceMember
      }
    }
  }
`
