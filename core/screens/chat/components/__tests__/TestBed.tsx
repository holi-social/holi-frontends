import { MockedProvider, MockedResponse } from '@apollo/client/testing'
import { atom } from 'jotai'
import React from 'react'

import { ChatRoomMember } from '@holi/chat/src/client/types'
import ChatStoreInitializer from '@holi/chat/src/components/ChatStoreInitializer'
import { ChatRoom, RoomAtomByRoomId, roomAtomsRecordInitializationAtom } from '@holi/chat/src/store'
import { usersByChatIdentitiesQuery } from '@holi/core/screens/userprofile/queries'

export function TestBed(
  props: React.PropsWithChildren<{
    // Parameters<typeof useHydrateAtoms>[0][]
    jotaiAtoms: never[][]
    apolloMocks: MockedResponse[]
  }>
) {
  return (
    <ChatStoreInitializer initialAtoms={props.jotaiAtoms}>
      <MockedProvider mocks={props.apolloMocks} addTypename={false}>
        {props.children}
      </MockedProvider>
    </ChatStoreInitializer>
  )
}

export function atomsFor(rooms: ChatRoom[]) {
  const roomAtomByRoomId = rooms.reduce<RoomAtomByRoomId>((acc, room) => {
    acc[room.id] = atom(room)
    return acc
  }, {})

  const roomAtomByRoomIdAtom = [roomAtomsRecordInitializationAtom, roomAtomByRoomId]
  return [roomAtomByRoomIdAtom] as never
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
