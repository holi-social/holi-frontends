import { act, renderHook } from '@testing-library/react-hooks'
import { waitFor } from '@testing-library/react-native'
import { when } from 'jest-when'
import { Provider, createStore, useAtom, useAtomValue } from 'jotai'
import { ClientEvent, IEvent, MatrixClient, MatrixEvent, Room, RoomEvent } from 'matrix-js-sdk'
import React from 'react'
import { PropsWithChildren } from 'react'

import ChatClient from '@holi/chat/src/client/ChatClient'
import { ChatRoomEvent, ChatRoomMember, MembershipStatus } from '@holi/chat/src/client/types'
import { _roomAtomsRecordAtomSubscriber, initChatClient, roomAtomsRecordAtom } from '@holi/chat/src/store/store'
import {
  createChatClient,
  createMatrixClientMock,
  createMatrixEventMock,
  createPrivateChatRoomResult,
  createRoomMock,
  getListenerForMatrixEvent,
} from '@holi/chat/src/test-utils'

jest.mock('matrix-js-sdk')
jest.mock('@holi/chat/src/client/pusher')

const useStoreRoomAtomsTest = () => {
  const roomAtomsRecord = useAtomValue(roomAtomsRecordAtom)
  useAtom(_roomAtomsRecordAtomSubscriber)
  return roomAtomsRecord
}

describe('Chat Store - rooms', () => {
  const wrapper = ({ children }: PropsWithChildren) => <Provider store={store}>{children}</Provider>
  let mxClient: jest.MockedObjectDeep<MatrixClient>
  let chatClient: ChatClient
  let store: ReturnType<typeof createStore>

  const roomId = 'roomId'
  const notificationCount = 0
  const spaceRoomId = '!space.room:holi.social'
  const spaceRoomName = 'space'
  const spaceChildRoomId = '!general.holi.social'
  const spaceChildRoomName = '#general'
  const holiSpaceId = 'holi-uuid'

  const admin: ChatRoomMember = {
    avatar: undefined,
    id: '@chat-admin:holi.social',
    membership: MembershipStatus.join,
    name: 'chat-admin',
  }

  const creator: ChatRoomMember = {
    avatar: 'https://unsplash.com/',
    id: '@creator.kato:holi.social',
    membership: MembershipStatus.join,
    name: 'creator',
  }

  const member: ChatRoomMember = {
    avatar: 'https://unsplash.com/',
    id: '@member1.feynman:holi.social',
    membership: MembershipStatus.join,
    name: 'member1',
  }

  beforeEach(() => {
    jest.clearAllTimers()
    mxClient = createMatrixClientMock()
    chatClient = createChatClient()
    store = createStore()
    initChatClient(chatClient)
  })

  it('should render the previously joined DM room - getJoinedRoomsWithSharedData', async () => {
    const members = [creator, member]

    const roomMock = createRoomMock(roomId, {
      members,
      timelineEvents: [],
      unreadNotificationCount: notificationCount,
      creatorId: creator.id,
      myMembership: MembershipStatus.join,
      getMember: creator,
      name: 'name',
    })

    mxClient.getRooms.mockReturnValue([roomMock])
    mxClient.roomState.mockResolvedValue([])

    const { result } = renderHook(() => useStoreRoomAtomsTest(), { wrapper })

    // Wait until the initial rooms are available
    await waitFor(() => {
      expect(result.current).toHaveProperty(roomId)
      expect(store.get(result.current[roomId])).toStrictEqual(
        createPrivateChatRoomResult(roomId, 'name', creator, members, notificationCount)
      )
    })
  })

  it('should render the previously joined space room - getJoinedRoomsWithSharedData', async () => {
    const member: ChatRoomMember = {
      avatar: 'https://unsplash.com/test',
      id: '@o-ren-ishii:holi.social',
      membership: MembershipStatus.join,
      name: 'O-Ren Ishii',
    }
    const members = [admin, member]

    const spaceChildRoomEventContent = {
      holiSpaceId,
      spaceName: spaceRoomName,
      avatarDefaultColor: '#7BD7EA',
      parentSpaceRoomId: spaceRoomId,
    }

    const roomMockOptions = {
      members,
      timelineEvents: [],
      unreadNotificationCount: notificationCount,
      creatorId: admin.id,
      getMember: admin,
      myMembership: MembershipStatus.join,
    }

    const spaceRoomMock = createRoomMock(spaceRoomId, { name: spaceRoomName, ...roomMockOptions })
    const spaceChildRoomMock = createRoomMock(spaceChildRoomId, { name: spaceChildRoomName, ...roomMockOptions })

    const rooms = [spaceRoomMock, spaceChildRoomMock]
    mxClient.getRooms.mockReturnValue(rooms)

    when(mxClient.roomState)
      .calledWith(spaceChildRoomId)
      .mockResolvedValue([
        {
          type: ChatRoomEvent.SharedData,
          room_id: spaceChildRoomId,
          sender: admin.id,
          content: spaceChildRoomEventContent,
          state_key: '',
          origin_server_ts: 1705480890010,
          event_id: '$bJL-z28AnpJCuo_FWlAHvnCZ0Xk4aOkcpRlxqhjq_Do',
        },
      ])
    when(mxClient.roomState)
      .calledWith(spaceRoomId)
      .mockResolvedValue([
        {
          type: ChatRoomEvent.SharedData,
          room_id: spaceRoomId,
          sender: admin.id,
          content: { holiSpaceId },
          state_key: '',
          origin_server_ts: 1701872060015,
          event_id: '$HpOGhRhXpmnIqG9LzfilcVeIaY-cUQgEy2cp8d3L3io',
        },
      ])

    // Mount and test
    const { result } = renderHook(() => useStoreRoomAtomsTest(), { wrapper })

    // Wait until the initial rooms are available
    await waitFor(() => {
      expect(Object.keys(result.current).length).toBe(2)

      expect(store.get(result.current[spaceRoomId])).toStrictEqual({
        type: 'space',
        avatar: undefined,
        content: { roomId: spaceRoomId, holiSpaceId },
        creator: admin,
        hasInvitation: false,
        id: spaceRoomId,
        lastMessage: undefined,
        members,
        name: spaceRoomName,
        notificationCount: notificationCount,
        timestamp: undefined,
      })

      expect(store.get(result.current[spaceChildRoomId])).toStrictEqual({
        type: 'space.child',
        avatar: undefined,
        content: {
          roomId: spaceChildRoomId,
          ...spaceChildRoomEventContent,
        },
        creator: admin,
        hasInvitation: false,
        id: spaceChildRoomId,
        lastMessage: undefined,
        members,
        name: spaceChildRoomName,
        notificationCount: notificationCount,
        timestamp: undefined,
      })
    })
  })

  it('should subscribeToNewRooms events and update the _roomAtomsRecordAtom', async () => {
    const dmRoomMembers = [creator, member]
    const timestamp = 1706715917444

    const dmRoomMock = createRoomMock(roomId, {
      members: dmRoomMembers,
      timelineEvents: [],
      unreadNotificationCount: notificationCount,
      creatorId: creator.id,
      getMember: creator,
      timestamp,
    })

    const { result } = renderHook(() => useStoreRoomAtomsTest(), { wrapper })

    expect(result.current[roomId]).toBeUndefined()

    // First DM comes in
    const newRoomListener = getListenerForMatrixEvent(mxClient, ClientEvent.Room, 'roomEventHandler') as (
      room: Room
    ) => void

    act(() => newRoomListener(dmRoomMock))

    expect(Object.entries(result.current).length).toBe(1)
    expect(result.current).toHaveProperty(roomId)
    expect(store.get(result.current[roomId])).toStrictEqual({
      avatar: undefined,
      creator,
      hasInvitation: false,
      id: roomId,
      lastMessage: undefined,
      members: dmRoomMembers,
      name: undefined,
      notificationCount: notificationCount,
      timestamp,
      type: 'private',
    })

    // Space Room Setup
    const spaceEventContent = {
      holiSpaceId,
      roomId: spaceRoomId,
    }

    const spaceChildEventContent = {
      holiSpaceId,
      roomId: spaceChildRoomId,
      spaceName: spaceRoomName,
      avatarDefaultColor: '#7BD7EA',
      parentSpaceRoomId: spaceRoomId,
    }

    const spaceSharedDataEvent = createMatrixEventMock(ChatRoomEvent.SharedData, spaceRoomId, spaceEventContent, {
      content: spaceEventContent,
      getTs: jest.fn(),
    } as unknown as IEvent)

    const spaceChildSharedDataEvent = createMatrixEventMock(
      ChatRoomEvent.SharedData,
      spaceChildRoomId,
      spaceChildEventContent,
      {
        content: spaceChildEventContent,
        getTs: jest.fn(),
      } as unknown as IEvent
    )

    const spaceRoomMembers = [admin, member]

    const spaceRoomMock = createRoomMock(spaceRoomId, {
      timestamp,
      timelineEvents: [],
      members: spaceRoomMembers,
      name: spaceRoomName,
      isSpaceRoom: true,
      creatorId: admin.id,
      getMember: admin,
      stateEvents: [spaceSharedDataEvent],
    })

    const spaceChildRoomMock = createRoomMock(spaceChildRoomId, {
      timestamp,
      members: spaceRoomMembers,
      timelineEvents: [],
      name: spaceChildRoomName,
      creatorId: admin.id,
      getMember: admin,
      stateEvents: [spaceChildSharedDataEvent],
    })

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

    expect(Object.entries(result.current).length).toBe(3)
    expect(store.get(result.current[spaceRoomId])).toStrictEqual({
      type: 'space',
      avatar: undefined,
      content: spaceEventContent,
      creator: admin,
      hasInvitation: false,
      id: spaceRoomId,
      lastMessage: undefined,
      members: spaceRoomMembers,
      name: spaceRoomName,
      notificationCount: notificationCount,
      timestamp,
    })

    expect(store.get(result.current[spaceChildRoomId])).toStrictEqual({
      type: 'space.child',
      avatar: undefined,
      content: spaceChildEventContent,
      creator: admin,
      hasInvitation: false,
      id: spaceChildRoomId,
      lastMessage: undefined,
      members: spaceRoomMembers,
      name: spaceChildRoomName,
      notificationCount: notificationCount,
      timestamp,
    })
  })
})
