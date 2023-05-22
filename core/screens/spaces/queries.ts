import { gql } from '@apollo/client/core'

import { memberSpacesFragment } from '@holi/core/queries'
import type { Space } from '@holi/core/screens/spaces/types'
import { userAvatarFragment } from '@holi/core/screens/userprofile/queries'
import type { MemberSpaces } from '@holi/core/types'

export const SpaceMemberFragment = gql`
  ${userAvatarFragment}
  fragment FullSpaceMember on SpaceMemberPaged {
    totalResults
    data {
      user {
        ...UserAvatar
      }
      isAdministrator
    }
  }
`

export const SpaceFragment = gql`
  ${SpaceMemberFragment}
  fragment FullSpace on Space {
    id
    title
    description
    contactEmail
    contactPhone
    contactDescription
    created
    avatar
    cover
    name
    avatarDefaultColor
    location
    geolocation {
      latitude
      longitude
    }
    connectionStatusToMyself
    links {
      type
      url
    }
    collaborationTools {
      id
      domain
      url
      description
      title
      collectionType
    }
    members {
      ...FullSpaceMember
    }
    tasks {
      id
      name
      description
      slotsAvailable
      slotsTaken
      location
      regularity
      visibility
      locationType
      contactEmail
      contactPhone
      creator {
        ...UserAvatar
      }
      skills {
        id
        title
        slug
      }
    }
    topics {
      id
      title
    }
    sdgs {
      id
      title
      number
    }
  }
`

export const topicsQuery = gql`
  query Topics {
    topics {
      data {
        id
        title
        isDiscoverSpacesDefault
        slug
      }
    }
  }
`

export const sdgsQuery = gql`
  query SDGs {
    sdgs {
      data {
        id
        title
        number
      }
    }
  }
`

export const spaceByIdQuery = gql`
  ${SpaceFragment}

  query SpaceById($idOrName: String!) {
    spaceById(idOrName: $idOrName) {
      ...FullSpace
    }
  }
`

export type SpaceByIdResponse = {
  spaceById: Space
}

export interface SpacesByMemberIdResponse {
  spaces: MemberSpaces
}

export const spacesByMemberIdQuery = gql`
  ${memberSpacesFragment}
  query SpacesByMember($memberId: UUID) {
    spaces(memberId: $memberId) {
      ...MemberSpaces
    }
  }
`
