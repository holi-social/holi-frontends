import type { DefaultOptions } from '@apollo/client'
import { MockedProvider } from '@apollo/client/testing'
import { act, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react-native'
import { createStore } from 'jotai'
import {
  ClientEvent,
  EventType,
  type IEvent,
  type MatrixClient,
  type MatrixEvent,
  type Room,
  RoomEvent,
} from 'matrix-js-sdk'
import React from 'react'

import { createCache } from '@holi/api/graphql/client'
import type ChatClient from '@holi/chat/src/client/ChatClient'
import { setChatConnected, setChatInitialized } from '@holi/chat/src/client/chatState'
import { ChatRoomEvent, type ChatRoomMember, MembershipStatus } from '@holi/chat/src/client/types'
import ChatHomeContent from '@holi/chat/src/components/ChatHomeContent'
import ChatProvider from '@holi/chat/src/components/ChatProvider'
import { initChatClient } from '@holi/chat/src/store'
import {
  ADMIN_FIXTURE,
  CREATOR_FIXTURE,
  DM_MEMBERS,
  DM_ROOM_ID,
  HOLI_CREATOR_FIXTURE,
  HOLI_CREATOR_ID_FIXTURE,
  HOLI_DM_USERS_FIXTURE,
  HOLI_MEMBER1_FIXTURE,
  HOLI_MEMBER1_ID_FIXTURE,
  HOLI_SPACE_USERS_FIXTURE,
  MEMBER1_FIXTURE,
  NOTIFICATION_COUNT,
  SPACE_CHILD_EVENT_CONTENT,
  SPACE_CHILD_ROOM_ID_FIXTURE,
  SPACE_CHILD_ROOM_NAME_FIXTURE,
  SPACE_EVENT_CONTENT,
  SPACE_MEMBERS_FIXTURE,
  SPACE_ROOM_ID_FIXTURE,
  SPACE_ROOM_NAME_FIXTURE,
  TIMESTAMP_FIXTURE,
  createChatClient,
  createMatrixClientMock,
  createMatrixEventMock,
  createRoomMock,
  getListenerForMatrixEvent,
} from '@holi/chat/src/test-utils'
import { type LoginState, useLoginState } from '@holi/core/auth/loginState'
import { authenticatedUserV2Query, usersByChatIdentitiesQuery } from '@holi/core/domain/shared/queries'
import type { User } from '@holi/core/domain/shared/types'

jest.mock('matrix-js-sdk')
jest.mock('@holi/chat/src/client/pusher')
jest.mock('@holi/core/auth/loginState')

const loggedIn = (userId: string): LoginState => ({
  isUnknown: false,
  isLoggedOut: false,
  isLoggedIn: true,
  userId: userId,
})

const loggedOut: LoginState = {
  isUnknown: false,
  isLoggedOut: true,
  isLoggedIn: false,
}

const useLoginStateMock = jest.mocked(useLoginState)
const defaultOptions: DefaultOptions = {
  watchQuery: { fetchPolicy: 'no-cache' },
  query: { fetchPolicy: 'no-cache' },
}

const getLoggedUserQueryMock = (user: User) => {
  return {
    request: {
      query: authenticatedUserV2Query,
      variables: { userId: user.id },
    },
    result: {
      data: {
        authenticatedUserV2: user,
      },
    },
  }
}

const getUserByChatIdQueryMock = (members: ChatRoomMember[], users: User[]) => {
  const identities = members.map((member) => {
    // Selects everything between @...: for an Marix Id (@member1.feynman:test.chat)
    const result = member.id.match(/(?<=@)(\w+(?:\.\w+)*)/g)
    if (result === null) return ''
    return result[0]
  })

  return {
    request: {
      query: usersByChatIdentitiesQuery,
      variables: {
        identities,
        offset: 0,
        limit: members.length,
      },
    },
    result: {
      data: {
        usersByChatIdentities: {
          data: users,
        },
      },
    },
  }
}

describe('ChatHomeContent Component', () => {
  let mxClient: jest.MockedObjectDeep<MatrixClient>
  let chatClient: ChatClient
  let store: ReturnType<typeof createStore>

  beforeEach(() => {
    mxClient = createMatrixClientMock()
    chatClient = createChatClient()
    store = createStore()
    initChatClient(chatClient)
    setChatInitialized(true)
    setChatConnected(true)
  })

  it('should render login info screen if the user is not logged-in', async () => {
    mxClient.createMessagesRequest.mockResolvedValue({ start: 'start', end: 'end', chunk: [] })

    useLoginStateMock.mockReturnValue(loggedOut)
    render(
      <MockedProvider mocks={[]} addTypename={false} cache={createCache()}>
        <ChatHomeContent />
      </MockedProvider>
    )

    expect(await screen.findByTestId('chat-login')).toBeOnTheScreen()
  })

  it('should render existing rooms', async () => {
    useLoginStateMock.mockReturnValue(loggedIn(HOLI_CREATOR_ID_FIXTURE))
    const roomName = 'room-name'
    const roomMock = createRoomMock(DM_ROOM_ID, {
      members: DM_MEMBERS,
      timelineEvents: [],
      unreadNotificationCount: NOTIFICATION_COUNT,
      creatorId: CREATOR_FIXTURE.id,
      myMembership: MembershipStatus.join,
      getMember: CREATOR_FIXTURE,
      name: roomName,
    })

    roomMock.getLastActiveTimestamp.mockReturnValue(TIMESTAMP_FIXTURE)

    mxClient.getRooms.mockReturnValue([roomMock])
    mxClient.roomState.mockResolvedValue([])
    mxClient.createMessagesRequest.mockResolvedValue({ start: 'start', end: 'end', chunk: [] })

    render(
      <MockedProvider
        mocks={[
          getLoggedUserQueryMock(HOLI_CREATOR_FIXTURE),
          getUserByChatIdQueryMock(DM_MEMBERS, HOLI_DM_USERS_FIXTURE),
        ]}
        addTypename={true}
        defaultOptions={defaultOptions}
        cache={createCache()}
      >
        <ChatProvider store={store}>
          <ChatHomeContent />
        </ChatProvider>
      </MockedProvider>
    )

    // During the loading phase we show the `<HoliLoader />`
    await waitForElementToBeRemoved(() => screen.getByTestId('chat-home-loader'))

    const displayedRoom = await screen.findByTestId(`room-item-${roomName}`)
    expect(displayedRoom).toHaveTextContent(roomName)
  })

  it('should render existing room with pending invitation', async () => {
    useLoginStateMock.mockReturnValue(loggedIn(HOLI_MEMBER1_ID_FIXTURE))
    const roomName = CREATOR_FIXTURE.name
    const roomMock = createRoomMock(DM_ROOM_ID, {
      members: DM_MEMBERS,
      timelineEvents: [],
      unreadNotificationCount: NOTIFICATION_COUNT,
      creatorId: CREATOR_FIXTURE.id,
      myMembership: MembershipStatus.invite,
      getMember: MEMBER1_FIXTURE,
      name: roomName,
    })

    roomMock.getLastActiveTimestamp.mockReturnValue(TIMESTAMP_FIXTURE)
    roomMock.hasMembershipState.mockReturnValue(true)

    mxClient.getRooms.mockReturnValue([roomMock])
    mxClient.roomState.mockResolvedValue([])
    mxClient.getUserId.mockReturnValue(MEMBER1_FIXTURE.id)
    mxClient.createMessagesRequest.mockResolvedValue({ start: 'start', end: 'end', chunk: [] })

    render(
      <MockedProvider
        mocks={[
          getLoggedUserQueryMock(HOLI_MEMBER1_FIXTURE),
          getUserByChatIdQueryMock(DM_MEMBERS, HOLI_DM_USERS_FIXTURE),
        ]}
        addTypename={false}
        defaultOptions={defaultOptions}
      >
        <ChatProvider store={store}>
          <ChatHomeContent />
        </ChatProvider>
      </MockedProvider>
    )

    const displayedRoom = await screen.findByTestId(`room-item-${roomName}`)
    expect(displayedRoom).toHaveTextContent(CREATOR_FIXTURE.name)
    expect(displayedRoom).toHaveTextContent('chat.invitation.newconversation')
  })

  it('should render incoming rooms', async () => {
    mxClient.createMessagesRequest.mockResolvedValue({ start: 'start', end: 'end', chunk: [] })

    useLoginStateMock.mockReturnValue(loggedIn(HOLI_MEMBER1_ID_FIXTURE))

    const spaceSharedDataEvent = createMatrixEventMock(ChatRoomEvent.SharedData, SPACE_ROOM_ID_FIXTURE, undefined, {
      content: SPACE_EVENT_CONTENT,
    } as unknown as IEvent)

    const spaceChildSharedDataEvent = createMatrixEventMock(
      ChatRoomEvent.SharedData,
      SPACE_CHILD_ROOM_ID_FIXTURE,
      undefined,
      {
        content: SPACE_CHILD_EVENT_CONTENT,
      } as unknown as IEvent
    )

    const spaceParentEvent = createMatrixEventMock(EventType.SpaceParent, SPACE_CHILD_ROOM_ID_FIXTURE, undefined, {
      content: { canonical: true },
      state_key: SPACE_ROOM_ID_FIXTURE,
      room_id: SPACE_CHILD_ROOM_ID_FIXTURE,
    } as unknown as IEvent)

    const spaceRoomMock = createRoomMock(SPACE_ROOM_ID_FIXTURE, {
      timestamp: TIMESTAMP_FIXTURE,
      timelineEvents: [],
      members: SPACE_MEMBERS_FIXTURE,
      name: SPACE_ROOM_NAME_FIXTURE,
      isSpaceRoom: true,
      creatorId: ADMIN_FIXTURE.id,
      getMember: ADMIN_FIXTURE,
      stateEvents: [spaceSharedDataEvent],
    })

    const spaceChildRoomMock = createRoomMock(SPACE_CHILD_ROOM_ID_FIXTURE, {
      timestamp: TIMESTAMP_FIXTURE,
      members: SPACE_MEMBERS_FIXTURE,
      timelineEvents: [],
      name: SPACE_CHILD_ROOM_NAME_FIXTURE,
      creatorId: ADMIN_FIXTURE.id,
      getMember: ADMIN_FIXTURE,
      stateEvents: [spaceChildSharedDataEvent, spaceParentEvent],
    })

    render(
      <MockedProvider
        mocks={[
          getLoggedUserQueryMock(HOLI_MEMBER1_FIXTURE),
          getUserByChatIdQueryMock(SPACE_MEMBERS_FIXTURE, HOLI_SPACE_USERS_FIXTURE),
        ]}
        addTypename={true}
        defaultOptions={defaultOptions}
        cache={createCache()}
      >
        <ChatProvider store={store}>
          <ChatHomeContent />
        </ChatProvider>
      </MockedProvider>
    )

    // During the loading phase we show the `<HoliLoader />`
    await waitForElementToBeRemoved(() => screen.getByTestId('chat-home-loader'))
    expect(await screen.findByTestId('chat-no-result')).toBeOnTheScreen()

    // Events starts coming in
    const newRoomListener = getListenerForMatrixEvent(mxClient, ClientEvent.Room, 'roomEventHandler') as (
      room: Room
    ) => void

    const sharedDataListener = getListenerForMatrixEvent(mxClient, RoomEvent.Timeline, 'handleSharedData') as (
      event: MatrixEvent,
      room: Room | undefined
    ) => void

    act(() => {
      newRoomListener(spaceRoomMock)
      newRoomListener(spaceChildRoomMock)
    })

    await waitFor(() => {
      act(() => {
        sharedDataListener(spaceSharedDataEvent, spaceRoomMock)
        sharedDataListener(spaceChildSharedDataEvent, spaceChildRoomMock)
      })
    })

    expect(screen.queryByTestId(`room-item-${SPACE_ROOM_NAME_FIXTURE}`)).not.toBeOnTheScreen()
    const displayedRoom = await screen.findByTestId(`room-item-${SPACE_CHILD_ROOM_NAME_FIXTURE}`)
    expect(displayedRoom).toHaveTextContent(SPACE_ROOM_NAME_FIXTURE)
  })
})
