import { act, render, screen, waitFor } from '@testing-library/react-native'
import { ClientEvent } from 'matrix-js-sdk'
import { ICreateClientOpts } from 'matrix-js-sdk/src/client'
import React from 'react'

import ChatHomeContent from '@holi/chat/src/components/ChatHomeContent'
import ChatStoreInitializer from '@holi/chat/src/components/ChatStoreInitializer'
import { createChatMemberFixture, createChatMessageFixture, createChatRoomFixture } from '@holi/chat/src/store'
import { CHAT_MOCK_USER_ID, mockMx, setMatrixMock } from '@holi/chat/src/test-utils/matrix-mock-setup'
import { User } from '@holi/core/screens/userprofile/types'

import { ChatTestBed, queriesFor, storeForRoomAtoms } from './ChatTestBed'
import { fireMatrixEvent, matrixRoomFrom } from './Matrix.testutils'
import { mockCreateClient } from './MatrixMockLogic.testutils'

interface MockLoggedInUserState {
  isLoggedIn: boolean
  isLoading: boolean
}

let mockLoggedInUser: User | undefined = undefined
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let mockOrySessionInStorage: Record<string, string> | undefined
let mockMatrixSessionInStorage: [string, boolean | string | undefined][]
let mockChatFeatureToggle: Record<string, boolean | string>
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

jest.mock('@holi/core/helpers/useFeatureToggle', () => ({
  useFeatureToggle: () => mockChatFeatureToggle,
  FeatureToggleName: {
    CHAT: 'CHAT',
  },
}))

jest.mock('@react-native-async-storage/async-storage', () => {
  return {
    multiGet: async () => mockMatrixSessionInStorage,
    multiSet: async () => mockMatrixSessionInStorage,
    multiRemove: async () => null,
  }
})

jest.mock('matrix-js-sdk', () => ({
  ...jest.requireActual('matrix-js-sdk'),
  createClient: (opts: ICreateClientOpts) => mockCreateClient({ mockMx, baseUrl: opts.baseUrl, userId: opts.userId! }),
}))

describe('ChatHome', () => {
  beforeEach(() => {
    mockChatFeatureToggle = {
      loading: false,
      error: false,
      status: 'FeatureToggleStatus.PRODUCTION',
      enabled: true,
    }
  })

  afterEach(() => {
    mockOrySessionInStorage = undefined
    mockLoggedInUser = undefined
    mockLoggedInUserState = undefined
    mockMatrixSessionInStorage = []
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
    beforeEach(() => {
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
        ['mx_user_id', CHAT_MOCK_USER_ID],
        ['mx_sso_token', 'someAccessToken'],
        ['mx_device', 'someDeviceId'],
      ]

      setMatrixMock(CHAT_MOCK_USER_ID)
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
