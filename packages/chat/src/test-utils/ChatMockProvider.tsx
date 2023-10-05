import { MockedProvider, MockedResponse } from '@apollo/client/testing'
import { atom, createStore } from 'jotai'
import React, { PropsWithChildren } from 'react'

import { ChatRoomMember } from '@holi/chat/src/client/types'
import ChatStoreInitializer from '@holi/chat/src/components/ChatStoreInitializer'
import { type ChatRoom, roomAtomsRecorAtomForTesting } from '@holi/chat/src/store'
import { usersByChatIdentitiesQuery } from '@holi/core/screens/userprofile/queries'

interface Props {
  jotaiStore?: ReturnType<typeof createStore>
  apolloMocks?: MockedResponse[]
}

export const ChatMockProvider = ({ children, jotaiStore, apolloMocks = [] }: PropsWithChildren<Props>) => {
  return (
    <ChatStoreInitializer store={jotaiStore}>
      <MockedProvider mocks={apolloMocks} addTypename={false}>
        {children}
      </MockedProvider>
    </ChatStoreInitializer>
  )
}

export const storeForRoomAtoms = (rooms: ChatRoom[]) => {
  const store = createStore()
  rooms.forEach((room) => {
    const prevroomAtomsRecord = store.get(roomAtomsRecorAtomForTesting)
    store.set(roomAtomsRecorAtomForTesting, { ...prevroomAtomsRecord, [room.id]: atom(room) })
  })

  return store
}

export function queriesFor(rooms: ChatRoom[], members: ChatRoomMember[]) {
  return [mockUsersByChatIdentitiesFor(rooms, members)]
}

function mockUsersByChatIdentitiesFor(rooms: ChatRoom[], members: ChatRoomMember[]) {
  return {
    request: {
      query: usersByChatIdentitiesQuery,
      variables: {
        // we use user identities as room names?
        identities: rooms.map((room) => room.name),
        offset: 0,
        limit: rooms.length,
      },
    },
    result: {
      data: {
        usersByChatIdentities: {
          data: members.map((member) => ({
            __typename: 'User',
            id: member.id,
            identity: member.name + 'Identity',
            fullName: member.name,
            avatarLabel: member.name[0],
            avatarDefaultColor: '',
            avatarBlurhash: 'avatarBlurhash',
            avatar: 'avatar.url',
            pronouns: '',
            aboutMe: '',
          })),
        },
      },
    },
  }
}
