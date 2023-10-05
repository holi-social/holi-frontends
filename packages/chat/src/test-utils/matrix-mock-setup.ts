import { EmittedEvents, MatrixClient } from 'matrix-js-sdk'

import { matrixMessageEventChunkFrom } from '@holi/chat/src/components/__tests__/Matrix.testutils'
import {
  initMatrixMock,
  mockedGetOrMakeRoom,
  mockedMatrixUsers,
  mockedRooms,
} from '@holi/chat/src/components/__tests__/MatrixMockLogic.testutils'

/* eslint-disable @typescript-eslint/no-explicit-any */
export const CHAT_SERVER_NAME_MOCK = 'chat.holi.social.mock'
export const CHAT_MOCK_USER_ID = 'satoshi.nakamoto'

export const mockMx = initMatrixMock()

export function setMatrixMock(userId: string) {
  mockMx.startClient = jest.fn(async () => {
    mockedMatrixUsers[userId].presence = 'online'
  })

  mockMx.stopClient = jest.fn(() => {
    delete mockedMatrixUsers[userId]
  })

  mockMx.registerRequest = jest.fn(
    async ({ username, device_id }: { username: string; password: string; device_id?: string }) => {
      userId = `@${username}:${CHAT_SERVER_NAME_MOCK}`
      mockedMatrixUsers[userId] = {
        userId,
        presence: 'offline',
      }
      userId = `@${username}:${CHAT_SERVER_NAME_MOCK}`
      return {
        user_id: userId,
        device_id: device_id ?? `${username}_device_id`,
        access_token: `${username}_access_token`,
      }
    }
  )

  mockMx.sendEvent = jest.fn(async (roomId: string, eventType: string, content: any) => {
    expect(roomId in mockedRooms).toBeTrue()
    mockMx.on(
      'Room.timeline',
      {
        getType: jest.fn(() => eventType),
        getSender: jest.fn(() => userId),
        getContent: jest.fn(() => content),
        event: { eventType, sender: userId, content },
      },
      mockMx.getRoom(roomId)
    )
    return {} as any
  })

  mockMx.sendToDevice = jest.fn(async () => ({}))

  mockMx.on = jest.fn((event: EmittedEvents, listener: (...args: any) => void | Promise<void>) => {
    if (event === 'sync') {
      listener('PREPARED')
    }
    return {} as MatrixClient
  })

  mockMx.searchUserDirectory = jest.fn(
    async ({ term }) =>
      ({
        results: Object.values(mockedMatrixUsers)
          .filter((u) => u.userId.includes(term))
          .map((u) => ({ user_id: u.userId, display_name: u.displayName, avatar_url: u.avatarUrl })),
      } as any)
  )
  mockMx.setPushRuleEnabled = jest.fn(async () => true)

  mockMx.getUserId = jest.fn(() => userId)

  mockMx.getUsers = jest.fn(() => Object.values(mockedMatrixUsers))

  mockMx.getUser = jest.fn((userId: string) => (mockedMatrixUsers[userId] as any) ?? null)

  mockMx.getProfileInfo = jest.fn(async (userId: string) => {
    if (!(userId in mockedMatrixUsers)) return {} as any
    return {
      displayname: mockedMatrixUsers[userId].displayName,
      avatar_url: mockedMatrixUsers[userId].avatarUrl,
    }
  })

  mockMx.setDisplayName = jest.fn(async (name: string) => {
    if (!(userId in mockedMatrixUsers)) return {}
    mockedMatrixUsers[userId].displayName = name
    return {}
  })

  mockMx.setAvatarUrl = jest.fn(async (avatarUrl: string) => {
    if (!(userId in mockedMatrixUsers)) return {}
    mockedMatrixUsers[userId].avatarUrl = avatarUrl
    mockedMatrixUsers[userId].presence = 'online'
    return {}
  })

  mockMx.setPresence = jest.fn(async ({ presence }: { presence: string }) => {
    if (!(userId in mockedMatrixUsers)) return
    mockedMatrixUsers[userId].presence = presence
    mockMx.on('event', {
      getType: jest.fn(() => 'm.presence'),
      getSender: jest.fn(() => userId),
      getContent: jest.fn(() => ({ presence })),
    })
  })

  mockMx.createRoom = jest.fn(async ({ invite }) => {
    const invitedUserId = invite![0]
    const roomId = `!roomId_${userId}_${invitedUserId}:${CHAT_SERVER_NAME_MOCK}`
    const room = mockedGetOrMakeRoom(roomId)
    room.members[userId] = 'join'
    return room
  })

  mockMx.getRoom = jest.fn((roomId: string | undefined) => {
    if (!roomId) return null
    if (!(roomId in mockedRooms) || !(userId in mockedRooms[roomId].members)) return null
    return mockedRooms[roomId] as any
  })

  mockMx.getRooms = jest.fn(() => {
    return Object.values(mockedRooms).filter((room) => userId in room.members) as any
  })

  mockMx.joinRoom = jest.fn(async (roomName: string) => {
    const roomId = `!${roomName}:${CHAT_SERVER_NAME_MOCK}`
    if (!(roomId in mockedRooms)) mockedGetOrMakeRoom(roomId)
    const room = mockedRooms[roomId]
    if (!room.aliases.includes(roomName)) room.aliases.push(roomName)
    room.members[userId] = 'join'
    return room as any
  })

  mockMx.getHomeserverUrl = jest.fn(() => CHAT_SERVER_NAME_MOCK)

  mockMx.invite = jest.fn(async (roomId: string, peerId: string) => {
    expect(roomId in mockedRooms).toBeTrue()
    const room = mockedRooms[roomId]
    //not a member?
    expect(room.getMember(userId)?.membership === 'join').toBeTrue()
    //Peer is already in the room?
    expect(room.getMember(peerId)?.membership !== 'join').toBeTrue()
    room.members[peerId] = 'invite'
  })

  mockMx.leave = jest.fn(async (roomId: string) => {
    expect(roomId in mockedRooms).toBeTrue()
    const room = mockedRooms[roomId]
    // is member?
    expect(room.getMember(userId)).toBeDefined()
    room.members[userId] = 'leave'
  })

  mockMx.createFilter = jest.fn(async () => true)

  mockMx.getPushRules = jest.fn(() => Promise.resolve())

  mockMx.getPushers = jest.fn().mockResolvedValue({
    pushers: [
      { pushkey: 'other pushkey', app_id: 'our app id' },
      { pushkey: 'some pushkey', app_id: 'our app id' },
    ],
  })

  mockMx.setPusher = jest.fn().mockResolvedValue('setPusherResponse')

  mockMx.getIgnoredUsers = jest.fn(() => [])

  mockMx.createMessagesRequest = jest.fn(async (roomName: string) => ({
    chunk: matrixMessageEventChunkFrom(`Hello all in ${roomName}`, CHAT_SERVER_NAME_MOCK),
    start: 't9-247_0_0_0_0_0_0_0_0_0',
    end: 't1-238_0_0_0_0_0_0_0_0_0',
  }))

  return mockMx
}
