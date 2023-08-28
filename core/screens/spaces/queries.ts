import { gql } from '@apollo/client/core'

import { memberSpacesFragment } from '@holi/core/queries'
import type { Space } from '@holi/core/screens/spaces/types'
import { FullUserAvatarFragment, FullUserFragment } from '@holi/core/screens/userprofile/queries'
import type { MemberSpaces } from '@holi/core/types'

export const FullSpaceMemberFragment = gql`
  ${FullUserAvatarFragment}
  fragment FullSpaceMember on SpaceMemberPaged {
    totalResults
    data {
      user {
        ...FullUserAvatar
      }
      isAdministrator
    }
  }
`

// We only need 3 members for avatar pile
export const FullSpaceFragment = gql`
  ${FullSpaceMemberFragment}
  ${FullUserFragment}
  fragment FullSpace on Space {
    id
    title
    description
    contactEmail
    contactPhone
    contactDescription
    created
    creator {
      ...FullUser
    }
    avatar
    avatarBlurhash
    cover
    coverBlurhash
    name
    avatarDefaultColor
    location
    hasPublicPosts
    hasPrivatePosts
    geolocation {
      latitude
      longitude
    }
    connectionStatusToMyself
    links {
      id
      type
      url
      name
    }
    collaborationTools {
      id
      domain
      url
      description
      title
      collectionType
      thumbnail
      thumbnailBlurhash
    }
    members(limit: 3) {
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
      thumbnail
      thumbnailBlurhash
      creator {
        ...FullUserAvatar
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
    onboarding {
      steps {
        text
      }
    }
  }
`

// We only need 3 members for avatar pile
export const SpaceOverviewFragment = gql`
  fragment SpaceOverview on Space {
    id
    title
    description
    cover
    coverBlurhash
    location
    avatar
    avatarBlurhash
    avatarDefaultColor
    name
    creator {
      id
    }
    members(limit: 3) {
      totalResults
      data {
        user {
          id
          avatar
          avatarBlurhash
          avatarLabel
          avatarDefaultColor
        }
      }
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
  ${FullSpaceFragment}

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
