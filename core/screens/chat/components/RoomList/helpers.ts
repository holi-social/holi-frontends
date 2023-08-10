import { useQuery } from '@apollo/client'
import { useAtomValue } from 'jotai'

import { ChatRoomAtom, roomAtomNameMapAtom } from '@holi/chat/src/store'
import {
  UsersByChatIdentitiesQueryVariables,
  UsersByChatIdentitiesResponse,
  usersByChatIdentitiesQuery,
} from '@holi/core/screens/userprofile/queries'
import { User } from '@holi/core/screens/userprofile/types'

export const useRoomAtomUserMap = () => {
  const roomAtomNameMap = useAtomValue(roomAtomNameMapAtom)
  const roomNames = [...new Set(roomAtomNameMap.values())]

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

  const roomAtomUserMap = new Map<ChatRoomAtom, User>()
  for (const [roomAtom, roomName] of roomAtomNameMap.entries()) {
    const user = users.find(({ identity }) => identity === roomName) ?? null
    if (user) {
      roomAtomUserMap.set(roomAtom, user)
    }
  }

  return {
    roomAtomUserMap,
    loading,
  }
}
