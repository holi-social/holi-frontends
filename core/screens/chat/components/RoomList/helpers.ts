import { useQuery } from '@apollo/client'
import { useAtomValue } from 'jotai'

import { roomIdNameRecortAtom } from '@holi/chat/src/store'
import {
  UsersByChatIdentitiesQueryVariables,
  UsersByChatIdentitiesResponse,
  usersByChatIdentitiesQuery,
} from '@holi/core/screens/userprofile/queries'
import { User } from '@holi/core/screens/userprofile/types'

export const useRoomIdUserRecord = () => {
  const roomIdNameRecord = useAtomValue(roomIdNameRecortAtom)
  const roomNames = [...new Set(Object.values(roomIdNameRecord))]

  const { data, loading } = useQuery<UsersByChatIdentitiesResponse, UsersByChatIdentitiesQueryVariables>(
    usersByChatIdentitiesQuery,
    {
      variables: {
        identities: roomNames,
        offset: 0,
        limit: roomNames.length,
      },
      skip: !roomNames.length,
    }
  )
  const users = data?.usersByChatIdentities.data ?? []
  const roomIdUserRecord = Object.entries(roomIdNameRecord).reduce((acc, [roomId, roomName]) => {
    const user = users.find(({ identity }) => identity === roomName) ?? null
    acc[roomId] = user
    return acc
  }, {} as Record<string, User | null>)

  return {
    roomIdUserRecord,
    loading,
  }
}
