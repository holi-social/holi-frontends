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

const toHoliIdentity = (matrixId: MatrixId): HoliIdentity => matrixId.replace('@', '').replace(`:${chatServerName}`, '')
const toMatrixIdentity = (holiIdentity: HoliIdentity): MatrixId => '@' + holiIdentity + ':' + chatServerName

export const useMatrixIdToHoliUserRecord = (rooms: ChatRoom[]) => {
  const roomMemberMatrixIds: MatrixId[] = rooms.flatMap((room) => room.members.map((member) => member.id))
  const roomMemberHoliIdentities = roomMemberMatrixIds.map(toHoliIdentity)

  const { data, loading } = useQuery<UsersByChatIdentitiesResponse, UsersByChatIdentitiesQueryVariables>(
    usersByChatIdentitiesQuery,
    {
      variables: {
        identities: roomMemberHoliIdentities,
        offset: 0,
        limit: roomMemberHoliIdentities.length,
      },
      skip: !roomMemberHoliIdentities.length,
    }
  )

  // might not contain holi users for every matrix ID
  // (e.g. because of data inconsistencies or because the holi user was already deleted but the Matrix user still exists)
  const roomMemberHoliUsers = data?.usersByChatIdentities.data ?? []

  const matrixIdToHoliUserRecord: Record<MatrixId, User> = roomMemberMatrixIds.reduce((acc, matrixId) => {
    return {
      ...acc,
      [matrixId]: roomMemberHoliUsers.find((holiUser) => holiUser.identity === toHoliIdentity(matrixId)),
    }
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
