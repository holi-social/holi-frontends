import { gql } from '@apollo/client/core'
import type { Task } from '@holi/api/graphql/graphql-codegen'

import type { FeedItem } from '@holi/core/screens/homeFeed/types'
import { FeedPostDetailsFragment } from '@holi/core/screens/individualPosts/fragments'
import { InsightFragment } from '@holi/core/screens/insights/queries'
import { PostFragment } from '@holi/core/screens/posts/queries'
import type { Paged } from '@holi/core/types'

export type NumberOfItems = {
  numberOfItems: number
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

export type RecommendedTasksQueryResponse = {
  recommendedTasks: Paged<Task>
}

export interface FeedResponse {
  feed: Paged<FeedItem>
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
