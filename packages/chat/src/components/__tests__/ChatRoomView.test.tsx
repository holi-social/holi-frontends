import { render, screen, waitForElementToBeRemoved } from '@testing-library/react-native'
import { ICreateClientOpts } from 'matrix-js-sdk/src/client'
import React from 'react'

import { createChatMemberFixture, createChatRoomFixture } from '@holi/chat/src/store'
import { ChatMockProvider, queriesFor, storeForRoomAtoms } from '@holi/chat/src/test-utils/ChatMockProvider'
import {
  CHAT_MOCK_USER_ID,
  mockCreateMatrixClient,
  mockMx,
  setMatrixMock,
} from '@holi/chat/src/test-utils/matrix-mock-setup'
import ChatRoomView from '@holi/core/screens/chat/ChatRoomView'
import { User } from '@holi/core/screens/userprofile/types'

interface MockLoggedInUserState {
  isLoggedIn: boolean
  isLoading: boolean
}

let mockLoggedInUser: User | undefined = undefined
let mockNavigationParam: string[] = []
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

jest.mock('@holi/core/navigation/hooks/useParam', () => () => ({
  useParam: () => mockNavigationParam,
}))

jest.mock('matrix-js-sdk', () => ({
  ...jest.requireActual('matrix-js-sdk'),
  createClient: (opts: ICreateClientOpts) => mockCreateMatrixClient(opts.userId ?? '', mockMx),
}))

describe('ChatRoomView', () => {
  beforeEach(() => {
    setMatrixMock(CHAT_MOCK_USER_ID)

    mockChatFeatureToggle = {
      loading: false,
      error: false,
      status: 'FeatureToggleStatus.PRODUCTION',
      enabled: true,
    }

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
  })

  afterEach(() => {
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
      <ChatMockProvider jotaiStore={storeForRoomAtoms(rooms)} apolloMocks={queriesFor(rooms, members)}>
        <ChatRoomView />
      </ChatMockProvider>
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
      <ChatMockProvider jotaiStore={storeForRoomAtoms(rooms)} apolloMocks={queriesFor(rooms, members)}>
        <ChatRoomView />
      </ChatMockProvider>
    )

    await waitForElementToBeRemoved(() => screen.queryByTestId('chat-room-loader'))

    // then it shows a message
    // the matrix sdk mock serves a canned message that is expected here
    await screen.findAllByText('Hello all in bobsRoom')

    // and it shows the input field
    await screen.findAllByTestId('chat-message-input-input')
  })
})
