import '@holi/core/components/Screen/mock'
import type { ApolloClient } from '@apollo/client'
import { MockedProvider } from '@apollo/client/testing/react'
import { act, renderRouter, screen, waitForElementToBeRemoved } from 'expo-router/testing-library'
import { createStore } from 'jotai'
import { EventType, type IEvent, type IRoomEvent, type MatrixClient } from 'matrix-js-sdk'
import React from 'react'

import { createCache } from '@holi/api/graphql/client'
import type ChatClient from '@holi/chat/src/client/ChatClient'
import { setChatConnected, setChatInitialized } from '@holi/chat/src/client/chatState'
import { ChatRoomEvent, type ChatRoomMember, MembershipStatus } from '@holi/chat/src/client/types'
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
  MEMBER2_FIXTURE,
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
} from '@holi/chat/src/test-utils'
import { type LoginStateLoggedIn, useLoginState } from '@holi/core/auth/loginState'
import { authenticatedUserV2Query, usersByChatIdentitiesQuery } from '@holi/core/domain/shared/queries'
import type { User } from '@holi/core/domain/shared/types'
import { mockParameters as useParamMock } from '@holi/core/navigation/hooks/useParam/__mocks__/mockParameters'
import ChatRoomView from '@holi/core/screens/chat/ChatRoomView'

jest.mock('matrix-js-sdk')
jest.mock('@holi/chat/src/client/pusher')
jest.mock('@holi/core/auth/loginState')
jest.mock('@holi/core/navigation/hooks/useParam')

const useLoginStateMock = jest.mocked(useLoginState)

const loggedIn = (userId: string): LoginStateLoggedIn => ({
  isUnknown: false,
  isLoggedOut: false,
  isLoggedIn: true,
  userId: userId,
})

const defaultOptions: ApolloClient.DefaultOptions = {
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

describe('ChatRoomView', () => {
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

  it('should show an invitation screen for new rooms', async () => {
    useParamMock({ roomId: DM_ROOM_ID })
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

    renderRouter({
      index: () => (
        <MockedProvider
          mocks={[
            getLoggedUserQueryMock(HOLI_MEMBER1_FIXTURE),
            getUserByChatIdQueryMock(DM_MEMBERS, HOLI_DM_USERS_FIXTURE),
          ]}
          defaultOptions={defaultOptions}
          cache={createCache()}
        >
          <ChatProvider store={store}>
            <ChatRoomView />
          </ChatProvider>
        </MockedProvider>
      ),
    })

    // During the loading phase we show the `<HoliLoader />`
    expect(await screen.findByTestId('chat-room-loader')).toBeOnTheScreen()

    expect(await screen.findByText('chat.invitation.copy')).toBeOnTheScreen()
    expect(await screen.findByText('chat.invitation.accept')).toBeOnTheScreen()
    expect(await screen.findByText('chat.invitation.reject')).toBeOnTheScreen()
  })

  it('should render a DM chat room', async () => {
    useParamMock({ roomId: DM_ROOM_ID })
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
    const msgBody = 'a very well crafted message'
    const msg: IRoomEvent = {
      type: EventType.RoomMessage,
      room_id: DM_ROOM_ID,
      sender: MEMBER2_FIXTURE.id,
      content: {
        body: msgBody,
        msgtype: 'm.text',
      },
      origin_server_ts: TIMESTAMP_FIXTURE,
      event_id: '$7vw3',
    }

    const msgRequest = Promise.resolve({ chunk: [msg] })
    mxClient.createMessagesRequest.mockReturnValue(msgRequest)

    renderRouter({
      index: () => (
        <MockedProvider
          mocks={[
            getLoggedUserQueryMock(HOLI_CREATOR_FIXTURE),
            getUserByChatIdQueryMock(DM_MEMBERS, HOLI_DM_USERS_FIXTURE),
          ]}
          defaultOptions={defaultOptions}
          cache={createCache()}
        >
          <ChatProvider store={store}>
            <ChatRoomView />
          </ChatProvider>
        </MockedProvider>
      ),
    })

    await act(async () => {
      await waitForElementToBeRemoved(() => screen.getByTestId('chat-room-loader'))
    })
    expect(await screen.findByText(msgBody)).toBeOnTheScreen()
    expect(await screen.findByTestId('chat-message-input-input')).toBeOnTheScreen()
  })

  it('should render a Space chat room', async () => {
    useParamMock({ roomId: SPACE_CHILD_ROOM_ID_FIXTURE })
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

    spaceRoomMock.getLastActiveTimestamp.mockReturnValue(TIMESTAMP_FIXTURE)
    spaceChildRoomMock.getLastActiveTimestamp.mockReturnValue(TIMESTAMP_FIXTURE)

    mxClient.getRooms.mockReturnValue([spaceRoomMock, spaceChildRoomMock])
    mxClient.roomState.mockResolvedValue([])

    const msgBody = 'another very well crafted message'
    const msg: IRoomEvent = {
      type: EventType.RoomMessage,
      room_id: SPACE_CHILD_ROOM_ID_FIXTURE,
      sender: MEMBER2_FIXTURE.id,
      content: {
        body: msgBody,
        msgtype: 'm.text',
      },
      origin_server_ts: 300000,
      event_id: '$7vw55555',
    }

    const msgRequest = Promise.resolve({ chunk: [msg] })
    mxClient.createMessagesRequest.mockReturnValue(msgRequest)

    renderRouter({
      index: () => (
        <MockedProvider
          mocks={[
            getLoggedUserQueryMock(HOLI_MEMBER1_FIXTURE),
            getUserByChatIdQueryMock(SPACE_MEMBERS_FIXTURE, HOLI_SPACE_USERS_FIXTURE),
          ]}
          defaultOptions={defaultOptions}
          cache={createCache()}
        >
          <ChatProvider store={store}>
            <ChatRoomView />
          </ChatProvider>
        </MockedProvider>
      ),
    })

    await act(async () => {
      await waitForElementToBeRemoved(() => screen.getByTestId('chat-room-loader'))
    })
    expect(await screen.findByText(msgBody)).toBeOnTheScreen()
    expect(await screen.findByText(MEMBER2_FIXTURE.name)).toBeOnTheScreen()
    expect(await screen.findByTestId('chat-message-input-input')).toBeOnTheScreen()
  })
})
