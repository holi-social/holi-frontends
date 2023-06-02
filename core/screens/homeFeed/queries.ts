import { gql } from '@apollo/client/core'

import { userAvatarFragment } from '@holi/core/screens/userprofile/queries'
import { User } from '@holi/core/screens/userprofile/types'
import { Paged } from '@holi/core/types'

export type NumberOfItems = {
  numberOfItems: number
}

export const userSuggestionsQuery = gql`
  ${userAvatarFragment}

  query UserSuggestions($limit: Int!) {
    userSuggestions(limit: $limit) {
      data {
        ...UserAvatar
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
