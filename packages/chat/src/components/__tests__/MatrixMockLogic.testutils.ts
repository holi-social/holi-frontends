/* eslint-disable @typescript-eslint/no-explicit-any */
import { MatrixClient } from 'matrix-js-sdk'

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
  }
} = {}

export function mockedGetOrMakeRoom(roomId: string) {
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
      currentState: { setStateEvents: () => ({}) },
    }
  }
  return mockedRooms[roomId]
}

export function initMatrixMock() {
  //stub out all the matrix sdk functions we use
  return {
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
}

export function mockCreateClient({ userId, mockMx }: { mockMx: any; baseUrl: string; userId: string }) {
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
    createRoom: (...args: any) => mockMx.createRoom(...args),
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
