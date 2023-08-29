import { jest } from '@jest/globals'
import { render, screen, waitFor } from '@testing-library/react-native'
import React from 'react'

import ChatStoreInitializer from '@holi/chat/src/components/ChatStoreInitializer'
import { createChatMemberFixture, createChatMessageFixture, createChatRoomFixture } from '@holi/chat/src/store'
import ChatHome from '@holi/core/screens/chat/ChatHome'
import { TestBed, atomsFor, queriesFor } from '@holi/core/screens/chat/components/__tests__/TestBed'
import { User } from '@holi/core/screens/userprofile/types'

// keep in sync with __mocks__/matrix-js-sdk.ts
const CHAT_SERVER_NAME = 'test.chat'
const CHAT_SERVER_URL = 'http://test.chat'

// skip logging matrix client internal stuff
console.debug = jest.fn()

jest.mock('@holi/core/helpers/config', () => ({
  chatServerName: CHAT_SERVER_NAME,
  chatServerUrl: CHAT_SERVER_URL,
  chatServerLoginUrl: CHAT_SERVER_URL,
  chatPushGatewayUrl: 'some.push.gateway.url',
}))

let mockLoggedInUser: User | undefined = undefined
let mockLoggedInUserState = {
  isLoggedIn: false,
  isLoading: false,
}
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

let mockOrySessionInStorage: Record<string, string> | undefined = {
  session_token: 'session_token_stub',
}
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
            <ChatHome />
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

      it('shows empty home chat view', async () => {
        render(
          <ChatStoreInitializer>
            <ChatHome />
          </ChatStoreInitializer>
        )

        await screen.findAllByText('chat.empty.tagline')
        await screen.findAllByText('chat.empty.headline')
        await screen.findAllByText('chat.empty.button.text')
      })

      it('shows a room in a list', async () => {
        const bob = createChatMemberFixture({ name: 'Bob' })
        const bobsRoom = createChatRoomFixture({
          // we use user identities as room names?
          name: 'BobIdentity',
          creator: bob,
        })
        bobsRoom.lastMessage = createChatMessageFixture('Moin!', bob)

        const members = [bob]
        const rooms = [bobsRoom]

        render(
          <TestBed jotaiAtoms={atomsFor(rooms)} apolloMocks={queriesFor(rooms, members)}>
            <ChatHome />
          </TestBed>
        )

        // then it shows the room list
        screen.queryByTestId('chat-room-list')

        // and it intermediately shows a skeleton for the room
        await waitFor(() => screen.queryByTestId('room-item-BobIdentity-skeleton'))
        await waitFor(() => !screen.queryByTestId('room-item-BobIdentity-skeleton'))

        //then it shows bobs room in a list
        const listedRoom = await screen.findByTestId('room-item-BobIdentity')
        //and its creator
        expect(listedRoom).toHaveTextContent('Bob')
        //and its last message
        expect(listedRoom).toHaveTextContent('Moin!')
      })
    })
  })
})
