import { EmittedEvents, ICreateRoomOpts, MatrixClient } from 'matrix-js-sdk'

import { matrixMessageEventChunkFrom } from '@holi/chat/src/test-utils/matrix-utils'

/* eslint-disable @typescript-eslint/no-explicit-any */
export const CHAT_SERVER_NAME_MOCK = 'chat.holi.social.mock'
export const CHAT_ROOM_NAME_MOCK = '!hackers-avenue:chat.holi.social.mock'
export const CHAT_MOCK_USER_ID = 'satoshi.nakamoto'

export const mockedMatrixUsers: {
  [userId: string]: {
    userId: string
    presence: string
    displayName?: string
    avatarUrl?: string
  }
} = {}

export const mockedRooms: {
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
    isSpaceRoom: () => boolean
  }
} = {}

export const mockMx = {
  startClient: jest.fn(),
  stopClient: jest.fn(),
  login: jest.fn(),
  register: jest.fn(),
  registerRequest: jest.fn(),
  setGuest: jest.fn(),
  setPushRuleEnabled: jest.fn(),
  searchUserDirectory: jest.fn(),
  getUserId: jest.fn(),
  getUsers: jest.fn(),
  getUser: jest.fn(),
  getProfileInfo: jest.fn(),
  setDisplayName: jest.fn(),
  setAvatarUrl: jest.fn(),
  setPresence: jest.fn(),
  getRoom: jest.fn(),
  getRooms: jest.fn(),
  createRoom: jest.fn(),
  joinRoom: jest.fn(),
  getHomeserverUrl: jest.fn(),
  invite: jest.fn(),
  leave: jest.fn(),
  sendEvent: jest.fn(),
  sendToDevice: jest.fn(),
  createFilter: jest.fn(),
  setMaxListeners: jest.fn(),
  setNotifTimelineSet: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
  clientRunning: jest.fn(),
  sendReadReceipt: jest.fn(),
  getPushRules: jest.fn(),
  getPushers: jest.fn(),
  removePusher: jest.fn(),
  setPusher: jest.fn(),
  setIgnoredUsers: jest.fn(),
  getIgnoredUsers: jest.fn(),
  createMessagesRequest: jest.fn(),
  forget: jest.fn(),
  store: jest.fn(),
}

export const mockedGetOrMakeRoom = (roomId: string) => {
  if (!(roomId in mockedRooms)) {
    mockedRooms[roomId] = {
      roomId,
      get room_id() {
        return this.roomId
      },
      members: {},
      aliases: [],
      isSpaceRoom() {
        return false
      },
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
      currentState: { setStateEvents: () => ({}) },
    }
  }
  return mockedRooms[roomId]
}

export const setMatrixMock = (userId: string) => {
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

export const mockCreateMatrixClient = (userId: string, mockMx: any) => {
  mockedMatrixUsers[userId] = {
    userId,
    presence: 'offline',
  }

  return {
    // assign our mock functions
    // the wrapper functions create a lexical scope,
    // which allows to set them later, from tests even after the module import resolve
    login: (...args: any) => mockMx.login(...args),
    startClient: (...args: any) => mockMx.startClient(...args),
    stopClient: (...args: any) => mockMx.stopClient(...args),
    register: (...args: any) => mockMx.register(...args),
    registerRequest: (...args: any) => mockMx.registerRequest(...args),
    searchUserDirectory: (...args: any) => mockMx.searchUserDirectory(...args),
    setPushRuleEnabled: (...args: any) => mockMx.setPushRuleEnabled(...args),
    getUserId: (...args: any) => mockMx.getUserId(...args),
    getUsers: (...args: any) => mockMx.getUsers(...args),
    getUser: (...args: any) => mockMx.getUser(...args),
    sendEvent: (...args: any) => mockMx.sendEvent(...args),
    sendToDevice: (...args: any) => mockMx.sendToDevice(...args),
    on: (...args: any) => mockMx.on(...args),
    off: (...args: any) => mockMx.off(...args),
    store: (...args: any) => mockMx.store(...args),
    getProfileInfo: (...args: any) => mockMx.getProfileInfo(...args),
    setDisplayName: (...args: any) => mockMx.setDisplayName(...args),
    setAvatarUrl: (...args: any) => mockMx.setAvatarUrl(...args),
    setPresence: (...args: any) => mockMx.setPresence(...args),
    createRoom: (options: ICreateRoomOpts) => {
      mockMx.createRoom(options)
      const roomId = CHAT_ROOM_NAME_MOCK
      const room = mockedGetOrMakeRoom(roomId)
      room.members[userId] = 'join'
      room.isSpaceRoom()
      return { room_id: roomId }
    },
    getRoom: (...args: any) => mockMx.getRoom(...args),
    getRooms: (...args: any) => mockMx.getRooms(...args),
    joinRoom: (...args: any) => mockMx.joinRoom(...args),
    getHomeserverUrl: (...args: any) => mockMx.getHomeserverUrl(...args),
    invite: (...args: any) => mockMx.invite(...args),
    leave: (...args: any) => mockMx.leave(...args),
    createFilter: (...args: any) => mockMx.createFilter(...args),
    getPushRules: (...args: any) => mockMx.getPushRules(...args),
    getPushers: (...args: any) => mockMx.getPushers(...args),
    setPusher: (...args: any) => mockMx.setPusher(...args),
    getIgnoredUsers: (...args: any) => mockMx.getIgnoredUsers(...args),
    createMessagesRequest: (...args: any) => mockMx.createMessagesRequest(...args),
    setMaxListeners: (...args: any) => mockMx.setMaxListeners(...args),
    setNotifTimelineSet: (...args: any) => mockMx.setNotifTimelineSet(...args),
    setGuest: (...args: any) => mockMx.setGuest(...args),
    clientRunning: (...args: any) => mockMx.clientRunning(...args),
    sendReadReceipt: (...args: any) => mockMx.sendReadReceipt(...args),
    removePusher: (...args: any) => mockMx.removePusher(...args),
    setIgnoredUsers: (...args: any) => mockMx.setIgnoredUsers(...args),
    forget: (...args: any) => mockMx.forget(...args),
  } as unknown as jest.Mocked<MatrixClient>
}
