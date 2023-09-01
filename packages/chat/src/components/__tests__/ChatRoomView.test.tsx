import { jest } from '@jest/globals'
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react-native'
import React from 'react'

import { TestBed, queriesFor, storeForRoomAtoms } from '@holi/chat/src/components/__tests__/TestBed'
import { createChatMemberFixture, createChatRoomFixture } from '@holi/chat/src/store'
import ChatRoomView from '@holi/core/screens/chat/ChatRoomView'
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

interface MockLoggedInUserState {
  isLoggedIn: boolean
  isLoading: boolean
}

let mockLoggedInUserState: MockLoggedInUserState | undefined = {
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

let mockNavigationParam: string[] = []
jest.mock('@holi/core/navigation/hooks/useParam', () => () => ({
  useParam: () => mockNavigationParam,
}))

describe('ChatRoomView', () => {
  describe('with feature-enabled chat', () => {
    beforeEach(() => {
      mockChatFeatureToggle = {
        loading: false,
        error: false,
        status: 'FeatureToggleStatus.PRODUCTION',
        enabled: true,
      }
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

      afterAll(() => {
        mockOrySessionInStorage = undefined
        mockLoggedInUser = undefined
        mockLoggedInUserState = undefined
        mockMatrixSessionInStorage = []
      })

      it('shows an invitation screen for a new room', async () => {
        const someMember = createChatMemberFixture({ name: 'defaultUserName' })
        const someRoom = createChatRoomFixture({
          // we use user identities as room names?
          name: someMember.name + 'Identity',
          hasInvitation: true,
          creator: someMember,
        })

        mockNavigationParam = [someRoom.id]
        const members = [someMember]
        const rooms = [someRoom]

        render(
          <TestBed store={storeForRoomAtoms(rooms)} apolloMocks={queriesFor(rooms, members)}>
            <ChatRoomView />
          </TestBed>
        )

        await waitForElementToBeRemoved(() => screen.queryByTestId('chat-room-loader'))

        await screen.findAllByText('chat.invitation.copy')
        await screen.findAllByText('chat.invitation.accept')
        await screen.findAllByText('chat.invitation.reject')
      })

      it('shows a complete room with message and input field', async () => {
        const bob = createChatMemberFixture({ name: 'Bob' })
        const bobsRoom = createChatRoomFixture({
          id: 'bobsRoom',
          // we use user identities as room names?
          name: 'BobIdentity',
          creator: bob,
          // bob is already in his room
          hasInvitation: false,
        })

        mockNavigationParam = [bobsRoom.id]
        mockMatrixSessionInStorage = [
          ['mx_client_login', true], //fresh?
          ['mx_user_id', 'BobIdentity'],
          ['mx_sso_token', 'bobsAccessToken'],
          ['mx_device', 'bobsDeviceId'],
        ]

        const members = [bob]
        const rooms = [bobsRoom]

        render(
          <TestBed store={storeForRoomAtoms(rooms)} apolloMocks={queriesFor(rooms, members)}>
            <ChatRoomView />
          </TestBed>
        )

        await waitForElementToBeRemoved(() => screen.queryByTestId('chat-room-loader'))

        // then it shows a message
        // the matrix sdk mock serves a canned message that is expected here
        await screen.findAllByText('Hello all in bobsRoom')

        // and it shows the input field
        await screen.findAllByTestId('chat-message-input-input')
      })
    })
  })
})
