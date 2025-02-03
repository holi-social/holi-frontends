import { gql } from '@apollo/client'

import { UserAvatarFragment } from '@holi/core/domain/shared/queries'
import {
  FullTaskFragment,
  SpaceInviteListFragment,
  SpaceMemberListFragment,
  SpaceMembershipRequestListFragment,
} from '@holi/core/screens/spaces/queries'
import type { Task } from '@holi/core/screens/spaces/types'

export const spaceMembersQuery = gql`
  ${SpaceMemberListFragment}

  query SpaceMembersBySpaceId($idOrName: String!, $offset: Int! = 0, $limit: Int! = 20) {
    spaceById(idOrName: $idOrName) {
      id
      members(limit: $limit, offset: $offset) {
        ...SpaceMemberList
      }
    }
  }
`

export const spaceMembershipRequestsQuery = gql`
  ${SpaceMembershipRequestListFragment}

  query SpaceMembershipRequestsBySpaceId($idOrName: String!, $offset: Int! = 0, $limit: Int! = 20) {
    spaceById(idOrName: $idOrName) {
      id
      membershipRequests(limit: $limit, offset: $offset) {
        ...SpaceMembershipRequestList
      }
    }
  }
`

export const spaceInvitesQuery = gql`
  ${SpaceInviteListFragment}

  query SpaceInvitesBySpaceId($idOrName: String!, $offset: Int! = 0, $limit: Int! = 20) {
    spaceById(idOrName: $idOrName) {
      id
      invites(limit: $limit, offset: $offset) {
        ...SpaceInviteList
      }
    }
  }
`

export const usersByNameWithSpaceConnectionQuery = gql`
  ${UserAvatarFragment}

  query UsersByNameWithSpaceConnection($substring: String!, $spaceId: UUID!, $limit: Int!, $offset: Int!) {
    userByName(substring: $substring, limit: $limit, offset: $offset) {
      data {
        ...UserAvatar
        connectionStatusToMyself
        connectionStatusToSpace(spaceId: $spaceId)
      }
      totalResults
    }
  }
`

export const userConnectionsQuery = gql`
  ${UserAvatarFragment}

  query ConnectedUsersWithSpaceConnection($spaceId: UUID!, $offset: Int! = 0, $limit: Int! = 20) {
    connectedUsers(limit: $limit, offset: $offset) {
      totalResults
      data {
        ...UserAvatar
        connectionStatusToSpace(spaceId: $spaceId)
        connectionStatusToMyself
      }
    }
  }
`

export const taskByIdQuery = gql`
  ${FullTaskFragment}

  query taskById($id: UUID!) {
    taskById(id: $id) {
      ...FullTask
    }
  }
`

export interface TaskByIdResponse {
  taskById: Task
}
