import { gql } from '@apollo/client'

import { FullSpaceMemberFragment } from '@holi/core/screens/spaces/queries'

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
