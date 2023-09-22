import { act, render, screen, waitFor } from '@testing-library/react-native'
import { ClientEvent, EmittedEvents, MatrixClient } from 'matrix-js-sdk'
import { ICreateClientOpts } from 'matrix-js-sdk/src/client'
import React from 'react'

import ChatHomeContent from '@holi/chat/src/components/ChatHomeContent'
import ChatStoreInitializer from '@holi/chat/src/components/ChatStoreInitializer'
import { createChatMemberFixture, createChatMessageFixture, createChatRoomFixture } from '@holi/chat/src/store'
import { User } from '@holi/core/screens/userprofile/types'

import { ChatTestBed, queriesFor, storeForRoomAtoms } from './ChatTestBed'
import { fireMatrixEvent, matrixMessageEventChunkFrom, matrixRoomFrom } from './Matrix.testutils'
import {
  initMatrixMock,
  mockCreateClient,
  mockedGetOrMakeRoom,
  mockedMatrixUsers,
  mockedRooms,
} from './MatrixMockLogic.testutils'

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable prefer-const */

// skip logging matrix client internal stuff
// remove the next line while you are working on tests
console.debug = jest.fn()

export const CHAT_SERVER_NAME = 'test.chat'
export const CHAT_SERVER_URL = 'http://test.chat'

jest.mock('@holi/core/helpers/config', () => ({
  chatServerName: CHAT_SERVER_NAME,
  chatServerUrl: CHAT_SERVER_URL,
  chatServerLoginUrl: CHAT_SERVER_URL,
  chatPushGatewayUrl: 'some.push.gateway.url',
}))

let mockLoggedInUser: User | undefined
let mockLoggedInUserState:
  | {
      isLoggedIn: boolean
      isLoading: boolean
    }
  | undefined

jest.mock('@holi/core/screens/userprofile/useLoggedInUser', () => ({
  useLoggedInUser: () => ({
    user: mockLoggedInUser,
    ...mockLoggedInUserState,
    refetch: jest.fn(),
  }),
}))

let mockChatFeatureToggle: Record<string, boolean | string>
jest.mock('@holi/core/helpers/useFeatureToggle', () => ({
  useFeatureToggle: () => mockChatFeatureToggle,
  FeatureToggleName: {
    CHAT: 'CHAT',
  },
}))

let mockOrySessionInStorage: Record<string, string> | undefined
jest.mock('@holi/core/auth/helpers/auth', () => ({
  getSessionFromStorage: () => {
    return Promise.resolve(mockOrySessionInStorage)
  },
}))

jest.mock('cross-fetch', () => (url: string) => {
  if (`${CHAT_SERVER_URL}/_matrix/client/r0/login` === url) {
    const mockMatrixResponse = {
      user_id: '@someUserIdentity:test.chat',
      access_token: 'syt_Z3JlZ29yMA_someAccessToken',
      home_server: CHAT_SERVER_URL,
      device_id: 'NGRTsomeDeviceId',
    }
    return Promise.resolve(new Response(JSON.stringify(mockMatrixResponse)))
  }
  throw new Error("cross-fetch mock didn't handle a call for: " + url)
})

let mockMatrixSessionInStorage: [string, boolean | string | undefined][]
jest.mock('@react-native-async-storage/async-storage', () => {
  return {
    multiGet: async () => mockMatrixSessionInStorage,
    multiSet: async () => mockMatrixSessionInStorage,
    multiRemove: async () => null,
  }
})

const mockMx = initMatrixMock()

function setMatrixMock({ userId }: { userId: string }) {
  mockMx.startClient = jest.fn(async () => {
    mockedMatrixUsers[userId].presence = 'online'
  })

  mockMx.stopClient = jest.fn(() => {
    delete mockedMatrixUsers[userId]
  })

  mockMx.registerRequest = jest.fn(
    async ({ username, device_id }: { username: string; password: string; device_id?: string }) => {
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
    const roomId = `!roomId_${userId}_${invitedUserId}:${CHAT_SERVER_NAME}`
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
    const roomId = `!${roomName}:${CHAT_SERVER_NAME}`
    if (!(roomId in mockedRooms)) mockedGetOrMakeRoom(roomId)
    const room = mockedRooms[roomId]
    if (!room.aliases.includes(roomName)) room.aliases.push(roomName)
    room.members[userId] = 'join'
    return room as any
  })

  mockMx.getHomeserverUrl = jest.fn(() => CHAT_SERVER_NAME)

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
    chunk: matrixMessageEventChunkFrom(`Hello all in ${roomName}`, CHAT_SERVER_NAME),
    start: 't9-247_0_0_0_0_0_0_0_0_0',
    end: 't1-238_0_0_0_0_0_0_0_0_0',
  }))
}

jest.mock('matrix-js-sdk', () => ({
  ...jest.requireActual<any>('matrix-js-sdk'),
  createClient: (opts: ICreateClientOpts) => mockCreateClient({ mockMx, baseUrl: opts.baseUrl, userId: opts.userId! }),
}))

describe('ChatHome', () => {
  describe('with feature-enabled chat', () => {
    beforeAll(() => {
      mockChatFeatureToggle = {
        loading: false,
        error: false,
        status: 'FeatureToggleStatus.PRODUCTION',
        enabled: true,
      }
    })

    describe('for guests', () => {
      beforeAll(() => {
        mockOrySessionInStorage = {}
        mockLoggedInUser = undefined
        mockLoggedInUserState = {
          isLoggedIn: false,
          isLoading: false,
        }
        mockMatrixSessionInStorage = [
          ['mx_client_login', undefined],
          ['mx_user_id', undefined],
          ['mx_sso_token', undefined],
          ['mx_device', undefined],
        ]
      })

      it('shows login hint', async () => {
        render(
          <ChatStoreInitializer>
            <ChatHomeContent />
          </ChatStoreInitializer>
        )

        await screen.findAllByText('loginRedirect.title')
        await screen.findAllByText('loginRedirect.text')
      })
    })

    describe('for signed-in user', () => {
      beforeAll(() => {
        mockOrySessionInStorage = {
          session_token: 'session_token_stub',
        }
        mockLoggedInUser = {
          id: 'someLoggedInUserId',
          avatarDefaultColor: '',
          avatarLabel: '',
          fullName: '',
          identity: 'someLoggedInUserIdentity',
        }
        mockLoggedInUserState = {
          isLoggedIn: true,
          isLoading: false,
        }
        mockMatrixSessionInStorage = [
          ['mx_client_login', true], //fresh?
          ['mx_user_id', 'someMatrixUserId'],
          ['mx_sso_token', 'someAccessToken'],
          ['mx_device', 'someDeviceId'],
        ]
      })

      beforeEach(() => {
        setMatrixMock({ userId: 'someMatrixUserId' })
      })

      it('shows empty home chat view', async () => {
        // it doesn't need any mocks

        render(
          <ChatStoreInitializer>
            <ChatHomeContent />
          </ChatStoreInitializer>
        )

        await screen.findAllByText('chat.empty.tagline')
        await screen.findAllByText('chat.empty.headline')
        await screen.findAllByText('chat.empty.button.text')
      })

      it('shows an existing room', async () => {
        // given bobs pre-existing room with a message
        const bob = createChatMemberFixture({ name: 'Bob' })
        const bobsRoom = createChatRoomFixture({
          // we use user identities as room names?
          name: 'BobIdentity',
          creator: bob,
        })
        bobsRoom.lastMessage = createChatMessageFixture('Moin!', bob)

        const members = [bob]
        const rooms = [bobsRoom]

        // when rendering the chat home
        render(
          <ChatTestBed jotaiStore={storeForRoomAtoms(rooms)} apolloMocks={queriesFor(rooms, members)}>
            <ChatHomeContent />
          </ChatTestBed>
        )

        // then it shows the room list
        await screen.findByTestId('chat-room-list')

        // and it intermediately shows a skeleton for the room
        await waitFor(() => screen.queryByTestId('room-item-BobIdentity-skeleton'))
        await waitFor(() => !screen.queryByTestId('room-item-BobIdentity-skeleton'))

        // then it shows bobs room in a list, with its last message
        const listedRoom = await screen.findByTestId('room-item-BobIdentity')
        expect(listedRoom).toHaveTextContent('Bob')
        expect(listedRoom).toHaveTextContent('Moin!')
      })

      it('shows an incoming room', async () => {
        const aliceRoom = createChatRoomFixture({
          // we use user identities as room names?
          name: 'AliceIdentity',
        })

        render(
          <ChatTestBed>
            <ChatHomeContent />
          </ChatTestBed>
        )

        act(() => {
          fireMatrixEvent(mockMx.on, ClientEvent.Room, matrixRoomFrom(aliceRoom))
        })

        await screen.findByTestId('chat-room-list')
        await screen.findByTestId('room-item-AliceIdentity')
      })
    })
  })
})

afterAll(() => {
  mockOrySessionInStorage = undefined
  mockLoggedInUser = undefined
  mockLoggedInUserState = undefined
  mockMatrixSessionInStorage = []
})
