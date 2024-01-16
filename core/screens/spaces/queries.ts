import { gql } from '@apollo/client/core'

import { MemberSpacesFragment } from '@holi/core/queries'
import type { Space } from '@holi/core/screens/spaces/types'
import { UserAvatarFragment } from '@holi/core/screens/userprofile/queries'
import type { MemberSpaces } from '@holi/core/types'

const SpaceMemberPermissionsFragment = gql`
  ${UserAvatarFragment}
  fragment SpaceMemberPermissions on User {
    ...UserAvatar
    aboutMe
    pronouns
  }
`

export const SpaceMemberListFragment = gql`
  ${SpaceMemberPermissionsFragment}
  fragment SpaceMemberList on SpaceMemberPaged {
    totalResults
    data {
      id
      user {
        ...SpaceMemberPermissions
      }
      isAdministrator
    }
  }
`

export const SpaceMembershipRequestListFragment = gql`
  ${SpaceMemberPermissionsFragment}
  fragment SpaceMembershipRequestList on SpaceMembershipRequestPaged {
    totalResults
    data {
      id
      message
      user {
        ...SpaceMemberPermissions
      }
    }
  }
`

export const SpaceInviteListFragment = gql`
  ${SpaceMemberPermissionsFragment}
  fragment SpaceInviteList on SpaceInvitePaged {
    totalResults
    data {
      id
      invitedUser {
        ...SpaceMemberPermissions
      }
    }
  }
`

// We only need 3 members for avatar pile and only a few properties are necessary for the members overlay
export const FullSpaceFragment = gql`
  ${UserAvatarFragment}
  fragment FullSpace on Space {
    id
    title
    description
    contactEmail
    contactPhone
    contactDescription
    created
    creator {
      ...UserAvatar
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
      totalResults
      data {
        id
        isAdministrator
        user {
          ...UserAvatar
        }
      }
    }
    membershipRequests(limit: 0) {
      totalResults
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
    onboarding {
      steps {
        text
      }
    }
  }
`

// We only need 3 members for avatar pile and only a few properties are necessary for the members overlay
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
          identity
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

export const spaceMembershipByIdQuery = gql`
  query SpaceById($idOrName: String!) {
    spaceById(idOrName: $idOrName) {
      id
      name
      connectionStatusToMyself
      membershipRequests(limit: 0) {
        totalResults
      }
    }
  }
`

// limit of 100000 to ignore pagination and get all member ids
export const spaceByIdWithAllMembersQuery = gql`
  query SpaceById($idOrName: String!) {
    spaceById(idOrName: $idOrName) {
      id
      name
      connectionStatusToMyself
      members(limit: 100000) {
        totalResults
        data {
          user {
            id
          }
        }
      }
    }
  }
`

export const spacesByNameQuery = gql`
  ${SpaceOverviewFragment}

  query SpacesByName($substring: String!, $limit: Int!, $offset: Int!) {
    spacesByName(substring: $substring, limit: $limit, offset: $offset) {
      data {
        ...SpaceOverview
      }
      totalResults
    }
  }
`

export interface SpacesByMemberIdResponse {
  spaces: MemberSpaces
}

export const spacesByMemberIdQuery = gql`
  ${MemberSpacesFragment}
  query SpacesByMember($memberId: UUID) {
    spaces(memberId: $memberId) {
      ...MemberSpaces
    }
  }
`
