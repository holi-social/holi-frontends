import { useQuery } from '@apollo/client'

import { ChatRoomMember } from '@holi/chat/src/client/types'
import { ChatRoom } from '@holi/chat/src/store'
import { chatServerName } from '@holi/core/helpers/config'
import {
  UsersByChatIdentitiesQueryVariables,
  UsersByChatIdentitiesResponse,
  usersByChatIdentitiesQuery,
} from '@holi/core/screens/userprofile/queries'
import { User } from '@holi/core/screens/userprofile/types'

type HoliIdentity = string
type MatrixId = string // TODO create value type that ensures this is a valid Matrix ID

/**
 * Converts a Matrix ID (e.g. `@otto:holi.social`) to a Holi identity (e.g. `otto`).
 */
const toHoliIdentity = (matrixId: MatrixId): HoliIdentity =>
  matrixId.endsWith(`:${chatServerName}`) ? matrixId.substring(1, matrixId.indexOf(':')) : ''

/**
 * Converts a Holi identity (e.g. `otto`) to a Matrix ID (e.g. `@otto:holi.social`).
 */
const toMatrixIdentity = (holiIdentity: HoliIdentity): MatrixId => '@' + holiIdentity + ':' + chatServerName

/**
 * @returns a record to look up Holi `User` objects by Matrix ID (e.g. the user with identity `otto` for a given Matrix
 * ID `@otto:holi.social`)
 */
export const useMatrixIdToHoliUserRecord = (matrixIds: MatrixId[]) => {
  const holiIdentities = matrixIds.map(toHoliIdentity)

  const { data, loading } = useQuery<UsersByChatIdentitiesResponse, UsersByChatIdentitiesQueryVariables>(
    usersByChatIdentitiesQuery,
    {
      variables: {
        identities: holiIdentities,
        offset: 0,
        limit: holiIdentities.length,
      },
      skip: !holiIdentities.length,
    }
  )

  // might not contain holi users for every matrix ID
  // (e.g. because of data inconsistencies or because the holi user was already deleted but the Matrix user still exists)
  const holiUsers = data?.usersByChatIdentities.data ?? []

  const matrixIdToHoliUserRecord: Record<MatrixId, User> = matrixIds.reduce((record, matrixId) => {
    const holiUser = holiUsers.find((holiUser) => holiUser.identity === toHoliIdentity(matrixId))
    if (holiUser) {
      return {
        ...record,
        [matrixId]: holiUsers.find((holiUser) => holiUser.identity === toHoliIdentity(matrixId)),
      }
    }
    return record
  }, {})

  return {
    matrixIdToHoliUserRecord,
    loading,
  }
}

export const isRoomCreator = (user: User, room: ChatRoom): boolean | undefined => {
  return room.creator ? room.creator.id === toMatrixIdentity(user.identity) : undefined
}

export const getChatPartner = (loggedInUser: User, room: ChatRoom): ChatRoomMember | undefined => {
  // TODO this will have to be changed once we support multiple users per room
  return room.members.find((member) => member.id !== toMatrixIdentity(loggedInUser.identity))
}
