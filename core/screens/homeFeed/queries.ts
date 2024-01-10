import { gql } from '@apollo/client/core'

import { PostFragment } from '@holi/core/screens/posts/queries'
import { Post } from '@holi/core/screens/posts/types'
import { UserAvatarFragment } from '@holi/core/screens/userprofile/queries'
import { User } from '@holi/core/screens/userprofile/types'
import { Paged } from '@holi/core/types'

export type NumberOfItems = {
  numberOfItems: number
}

export const userSuggestionsQuery = gql`
  ${UserAvatarFragment}

  query UserSuggestions($limit: Int! = 10) {
    userSuggestions(limit: $limit) {
      data {
        ...UserAvatar
        aboutMe
      }
    }
  }
`

export type UserSuggestionsResponse = {
  userSuggestions: Paged<User>
}

export enum NeedUpdateType {
  NO = 'NO',
  RECOMMENDED = 'RECOMMENDED',
  MANDATORY = 'MANDATORY',
}

export type NeedUpdate = {
  needUpdate: NeedUpdateType
  appStoreUrl: string
  playStoreUrl: string
}

export const checkAppVersionQuery = gql`
  query CheckAppVersion($version: String!, $buildNumber: String!) {
    checkAppVersion(version: $version, buildNumber: $buildNumber) {
      needUpdate
      appStoreUrl
      playStoreUrl
    }
  }
`

export type CheckAppVersionResponse = {
  checkAppVersion: NeedUpdate
}

export enum FeatureToggleStatus {
  OFF = 'OFF',
  PREVIEW = 'PREVIEW',
  PRODUCTION = 'PRODUCTION',
  MAINTENANCE = 'MAINTENANCE',
}

export type FeatureToggle = {
  name: string
  status: FeatureToggleStatus
}

export const featureTogglesQuery = gql`
  query FeatureToggles {
    featureToggles {
      name
      status
    }
  }
`

export type FeatureTogglesResponse = {
  featureToggles: FeatureToggle[]
}

export const inspirationPostsQuery = gql`
  ${PostFragment}
  query InspirationPosts($offset: Int = 0, $limit: Int = 10) {
    inspirationPosts(offset: $offset, limit: $limit) {
      data {
        ...PostFragment
      }
      totalResults
    }
  }
`

export type InspirationPostsQueryResponse = {
  inspirationPosts: Paged<Post>
}
