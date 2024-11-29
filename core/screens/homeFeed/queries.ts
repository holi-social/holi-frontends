import { gql } from '@apollo/client/core'

import { UserAvatarFragment } from '@holi/core/domain/shared/queries'
import type { User } from '@holi/core/domain/shared/types'
import { FeedPostDetailsFragment, GenericPostPagedFragment } from '@holi/core/screens/individualPosts/fragments'
import { InsightFragment } from '@holi/core/screens/insights/queries'
import { PostFragment } from '@holi/core/screens/posts/queries'
import type { Task } from '@holi/core/screens/spaces/types'
import type { Paged } from '@holi/core/types'

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

const taskFragment = gql`
  fragment TaskFragment on Task {
    id
    name
    description
    space {
      id
      title
      name
      avatar
      avatarBlurhash
      avatarDefaultColor
    }
    thumbnail
    thumbnailBlurhash
    location
    locationType
    regularity
    skills {
      id
      title
      slug
    }
  }
`

export const recommendedTasksQuery = gql`
  ${taskFragment}
  query RecommendedTasks($limit: Int) {
    recommendedTasks(limit: $limit) {
      data {
        ...TaskFragment
      }
      totalResults
    }
  }
`

export type RecommendedTasksQueryResponse = {
  recommendedTasks: Paged<Task>
}

export const feedQuery = gql`
  ${PostFragment}
  ${InsightFragment}
  ${FeedPostDetailsFragment}
  query feed($offset: Int! = 0, $limit: Int! = 2) {
    feed(offset: $offset, limit: $limit) {
      data {
        feedPost {
          ...FeedPostFull
        }
        spacePost {
          ...PostFragment
        }
        insight {
          ...InsightFragment
        }
      }
      totalResults
    }
  }
`
