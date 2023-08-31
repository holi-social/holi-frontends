import { jest } from '@jest/globals'
import { EventEmitter } from 'events'
import { EmittedEvents, MatrixClient } from 'matrix-js-sdk'

export const CHAT_SERVER_NAME = 'test.chat'

type onFunctionType = (...args: any) => void | Promise<void>
type Listener = [EmittedEvents, onFunctionType]

const mockMatrixListeners: Listener[] = []

let mockSetPusher: jest.Mock | undefined
let mockRemovePusher: jest.Mock | undefined

const mockedClients: MatrixClient[] = []

const notImplemented = () => (): any => {
  //noop
}

const mockedMatrixUsers: {
  [userId: string]: {
    userId: string
    presence: string
    displayName?: string
    avatarUrl?: string
  }
} = {}

const mockedRooms: {
  [roomId: string]: {
    readonly roomId: string
    readonly room_id: string
    members: { [userId: string]: string }
    aliases: string[]
    getMember: (userId: string) => { membership: string; roomId: string; userId: string } | null
    getMyMembership: () => string | null
    getCanonicalAlias: () => string | null | undefined
    getAliases: () => string[]
    currentState: { setStateEvents: (state: any) => void }
  }
} = {}

function mockedGetOrMakeRoom(roomId: string) {
  if (!(roomId in mockedRooms)) {
    mockedRooms[roomId] = {
      roomId,
      get room_id() {
        return this.roomId
      },
      members: {},
      aliases: [],
      getMember(userId) {
        if (!(userId in this.members)) return null
        return { membership: this.members[userId], roomId, userId }
      },
      getMyMembership() {
        return 'join'
      },
      getCanonicalAlias() {
        return null
      },
      getAliases() {
        return this.aliases
      },
      currentState: { setStateEvents: notImplemented() },
    }
  }
  return mockedRooms[roomId]
}

function buildMessageEventChunk(messageBody: string) {
  return [
    {
      type: 'm.room.message',
      room_id: `!matrixMockRoomId:${CHAT_SERVER_NAME}`,
      sender: `@matrixMockSenderIdentity:${CHAT_SERVER_NAME}`,
      content: {
        body: messageBody,
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

function fakeMatrixClient({ userId }: { baseUrl: string; userId: string }): jest.Mocked<MatrixClient> {
  mockedMatrixUsers[userId] = {
    userId,
    presence: 'offline',
  }

  let stopped: (typeof mockedMatrixUsers)[string] | undefined

  const matrix = Object.assign(new EventEmitter(), {
    startClient: async () => {
      if (!(userId in mockedMatrixUsers) && stopped) mockedMatrixUsers[userId] = stopped
      stopped = undefined
      mockedMatrixUsers[userId].presence = 'online'
    },
    stopClient: () => {
      stopped = mockedMatrixUsers[userId]
      delete mockedMatrixUsers[userId]
    },
    login: notImplemented(),
    register: notImplemented(),
    registerRequest: ({ username, device_id }: { username: string; password: string; device_id?: string }) => {
      userId = `@${username}:${CHAT_SERVER_NAME}`
      mockedMatrixUsers[userId] = {
        userId,
        presence: 'offline',
      }
      userId = `@${username}:${CHAT_SERVER_NAME}`
      return {
        user_id: userId,
        device_id: device_id ?? `${username}_device_id`,
        access_token: `${username}_access_token`,
      }
    },
    setGuest: notImplemented(),
    setPushRuleEnabled: async () => true,
    searchUserDirectory: async ({ term }) => ({
      results: Object.values(mockedMatrixUsers)
        .filter((u) => u.userId.includes(term))
        .map((u) => ({ user_id: u.userId, display_name: u.displayName, avatar_url: u.avatarUrl })),
    }),
    getUserId: () => userId,
    getUsers: () => Object.values(mockedMatrixUsers),
    getUser: (userId: string) => mockedMatrixUsers[userId] ?? null,
    getProfileInfo: async (userId: string) => {
      if (!(userId in mockedMatrixUsers)) return null
      return {
        displayname: mockedMatrixUsers[userId].displayName,
        avatar_url: mockedMatrixUsers[userId].avatarUrl,
      }
    },
    setDisplayName: (displayname: string) => {
      if (!(userId in mockedMatrixUsers)) return
      mockedMatrixUsers[userId].displayName = displayname
    },
    setAvatarUrl: (avatarUrl: string) => {
      if (!(userId in mockedMatrixUsers)) return
      mockedMatrixUsers[userId].avatarUrl = avatarUrl
      mockedMatrixUsers[userId].presence = 'online'
    },
    setPresence: async ({ presence }: { presence: string }) => {
      if (!(userId in mockedMatrixUsers)) return
      mockedMatrixUsers[userId].presence = presence
      for (const matrix of mockedClients) {
        matrix.emit('event' as any, {
          getType: () => 'm.presence',
          getSender: () => userId,
          getContent: () => ({ presence }),
        })
      }
    },
    createRoom: async ({ invite }) => {
      const invitedUserId = invite[0]
      const roomId = `!roomId_${userId}_${invitedUserId}:${CHAT_SERVER_NAME}`
      if (!(roomId in mockedRooms)) {
        const room = mockedGetOrMakeRoom(roomId)
        room.members[userId] = 'join'
      }
      const room = mockedRooms[roomId]
      if (invite?.[0]) await matrix.invite(room.roomId, invite[0])
      matrix.emit('Room.myMembership' as any, room, room.members[userId])
      return room
    },
    getRoom: (roomId: string) => {
      if (!(roomId in mockedRooms) || !(userId in mockedRooms[roomId].members)) return null
      return mockedRooms[roomId]
    },
    joinRoom: async (roomName: string) => {
      const roomId = `!${roomName}:${CHAT_SERVER_NAME}`
      if (!(roomId in mockedRooms)) mockedGetOrMakeRoom(roomId)
      const room = mockedRooms[roomId]
      if (!room.aliases.includes(roomName)) room.aliases.push(roomName)
      room.members[userId] = 'join'
      for (const matrix of mockedClients) {
        if (!room.getMember(matrix.getUserId()!)) continue
        matrix.emit('RoomMember.membership' as any, { getSender: () => userId }, room.getMember(userId))
      }
      matrix.emit('Room.myMembership' as any, room, room.members[userId])
      return room
    },
    getRooms: () => Object.values(mockedRooms).filter((room) => userId in room.members),
    getHomeserverUrl: () => CHAT_SERVER_NAME,
    invite: async (roomId: string, peerId: string) => {
      expect(roomId in mockedRooms).toBeTrue()
      const room = mockedRooms[roomId]
      //not a member?
      expect(room.getMember(userId)?.membership === 'join').toBeTrue()
      //Peer is already in the room?
      expect(room.getMember(peerId)?.membership !== 'join').toBeTrue()
      room.members[peerId] = 'invite'
      for (const matrix of mockedClients) {
        if (!room.getMember(matrix.getUserId()!)) continue
        matrix.emit('RoomMember.membership' as any, { getSender: () => userId }, room.getMember(peerId))
      }
    },
    leave: async (roomId: string) => {
      expect(roomId in mockedRooms).toBeTrue()
      const room = mockedRooms[roomId]
      // is member?
      expect(room.getMember(userId)).toBeDefined()
      room.members[userId] = 'leave'
      for (const matrix of mockedClients) {
        if (!room.getMember(matrix.getUserId()!)) continue
        matrix.emit('RoomMember.membership' as any, { getSender: () => userId }, room.getMember(userId))
      }
      matrix.emit('Room.myMembership' as any, room, room.members[userId])
    },
    sendEvent: async (roomId: string, type: string, content: any) => {
      if (stopped) return true
      expect(roomId in mockedRooms).toBeTrue()
      const room = mockedRooms[roomId]
      for (const matrix of mockedClients) {
        if (!room.getMember(matrix.getUserId()!)) continue
        matrix.emit(
          'Room.timeline' as any,
          {
            getType: () => type,
            getSender: () => userId,
            getContent: () => content,
            event: { type, sender: userId, content },
          },
          matrix.getRoom(roomId)
        )
      }
      return true
    },
    sendToDevice: async (type: string, contentMap: { [userId: string]: { [deviceID: string]: any } }) => {
      if (stopped) return true
      for (const [partnerId, map] of Object.entries(contentMap)) {
        for (const matrix of mockedClients) {
          if (partnerId !== matrix.getUserId()) continue
          for (const content of Object.values(map)) {
            matrix.emit('toDeviceEvent' as any, {
              getType: () => type,
              getSender: () => userId,
              getContent: () => content,
              event: { type, sender: userId, content },
            })
          }
        }
      }
    },
    store: {
      storeRoom: notImplemented(),
    },
    createFilter: async () => true,
    setMaxListeners: notImplemented(),
    setNotifTimelineSet: notImplemented(),
    on: (event: EmittedEvents, fn: onFunctionType) => {
      mockMatrixListeners.push([event, fn])
      if (event === 'sync') {
        fn('PREPARED')
      }
    },
    off: notImplemented(),
    getPushRules: () => Promise.resolve(),
    getPushers: () =>
      Promise.resolve({
        pushers: [
          { pushkey: 'other pushkey', app_id: 'our app id' },
          { pushkey: 'some pushkey', app_id: 'our app id' },
        ],
      }),
    removePusher: (pushkey: string, app_id: string) => mockRemovePusher?.(pushkey, app_id),
    setPusher: (pusher: unknown) => {
      mockSetPusher?.(pusher)
      return Promise.resolve()
    },
    getIgnoredUsers: () => [],
    createMessagesRequest: async (roomName: string) => ({
      chunk: buildMessageEventChunk(`Hello all in ${roomName}`),
      start: 't9-247_0_0_0_0_0_0_0_0_0',
      end: 't1-238_0_0_0_0_0_0_0_0_0',
    }),
  }) as unknown as jest.Mocked<MatrixClient>
  return matrix
}

module.exports = {
  ...jest.requireActual<any>('matrix-js-sdk'),
  createClient: fakeMatrixClient,
}
