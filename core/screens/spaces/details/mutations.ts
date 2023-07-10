import { gql } from '@apollo/client'

import { Space } from '@holi/core/screens/spaces/types'

export interface DeleteSpaceResponse {
  success: boolean
}

export const deleteSpaceMutation = gql`
  mutation DeleteSpace($id: UUID!) {
    deleteSpace(id: $id) {
      success
    }
  }
`

export const updateSpaceUserConnectionMutation = gql`
  mutation UpdateSpaceUserConnection(
    $connectAction: UpdateConnectionAction!
    $connectionType: SpaceUserConnectionType!
    $spaceId: UUID!
    $userId: UUID
  ) {
    updateSpaceUserConnection(
      connectAction: $connectAction
      connectionType: $connectionType
      spaceId: $spaceId
      userId: $userId
    ) {
      id
      connectionStatusToMyself
    }
  }
`

export type UpdateSpaceUserConnectionResponse = {
  updateSpaceUserConnection: Space
}

export const inviteToSpaceByEmailMutation = gql`
  mutation InviteToSpaceByEmail($email: String!, $spaceId: UUID!) {
    inviteToSpaceByEmail(email: $email, spaceId: $spaceId) {
      success
    }
  }
`

export type InviteToSpaceByEmailResponse = {
  success: boolean
}

export type SpaceUserConnectionType = string
