import { ClientEvent, MatrixClient, Room } from 'matrix-js-sdk'

import { ChatRoom } from '@holi/chat/src/client/types'

/* eslint-disable @typescript-eslint/no-explicit-any */

export const fireMatrixEvent = (
  mockedMatrixOnFn: jest.Mock<typeof MatrixClient.prototype.on>,
  matrixClientEvent: ClientEvent,
  eventBody: any
) => {
  mockedMatrixOnFn.mock.calls
    .filter((listener) => matrixClientEvent === listener[0])
    .map((eventListener) => eventListener[1])
    .forEach((eventListenerFn) => {
      eventListenerFn(eventBody)
    })
}

export const matrixRoomFrom = (chatRoom: ChatRoom, isSpaceRoom = false): Room => {
  return {
    roomId: chatRoom.id ?? 'testRoomId',
    name: chatRoom.name ?? 'testRoomName',
    hasMembershipState: () => false,
    getLastLiveEvent: () => undefined,
    getCreator: () => chatRoom.creator ?? 'testRoomCreator',
    getMember: () => null,
    getMembers: () => [],
    getUnreadNotificationCount: () => 0,
    getLastActiveTimestamp: () => 0,
    getLiveTimeline: () =>
      ({
        getState: () => ({
          getStateEvents: (eventType, stateKey?: string) => {
            if (stateKey !== undefined) return { getTs: () => 0 }
            else return [{ getTs: () => 0, getEffectiveEvent: () => this }]
          },
        }),
        getEvents: () => [],
      } as any),
    getMxcAvatarUrl: () => '',
    isSpaceRoom: () => isSpaceRoom,
    on: () => ({} as Room),
    off: () => ({}),
  } as unknown as Room
}

export const matrixMessageEventChunkFrom = (chatMessage: string, chatServerName: string) => {
  return [
    {
      type: 'm.room.message',
      room_id: `!matrixMockRoomId:${chatServerName}`,
      sender: `@matrixMockSenderIdentity:${chatServerName}`,
      content: {
        body: chatMessage,
        msgtype: 'm.text',
      },
      origin_server_ts: 0,
      unsigned: {
        age: 0,
        transaction_id: 'matrixMockMessageTransactionId',
      },
      event_id: 'matrixMockMessageEventId',
      age: 0,
    },
  ]
}
