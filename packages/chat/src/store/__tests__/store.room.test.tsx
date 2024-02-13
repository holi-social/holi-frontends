import { act, renderHook } from '@testing-library/react-hooks'
import { waitFor } from '@testing-library/react-native'
import { Provider, createStore, useAtom, useAtomValue } from 'jotai'
import { ClientEvent, EventType, IEvent, MatrixClient, MatrixEvent, Room, RoomEvent } from 'matrix-js-sdk'
import React from 'react'
import { PropsWithChildren } from 'react'

import ChatClient from '@holi/chat/src/client/ChatClient'
import { ChatRoomEvent, ChatRoomMember, MembershipStatus } from '@holi/chat/src/client/types'
import { _roomAtomsRecordAtomSubscriber, initChatClient, roomAtomsRecordAtom } from '@holi/chat/src/store/store'
import {
  createChatClient,
  createChatRoomResult,
  createMatrixClientMock,
  createMatrixEventMock,
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

  it('should render the previously joined DM room', () => {
    const timestamp = 1706715917444
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
    roomMock.getLastActiveTimestamp.mockReturnValue(timestamp)

    mxClient.getRooms.mockReturnValue([roomMock])
    mxClient.roomState.mockResolvedValue([])

    const { result } = renderHook(() => useStoreRoomAtomsTest(), { wrapper })

    // Wait until the initial rooms are available

    expect(result.current).toHaveProperty(roomId)
    expect(store.get(result.current[roomId])).toStrictEqual(
      createChatRoomResult(roomId, { name: 'name', creator, members, notificationCount, timestamp })
    )
  })

  it('should render the previously joined space room', () => {
    const timestamp = 1706703410441
    const member: ChatRoomMember = {
      avatar: 'https://unsplash.com/test',
      id: '@o-ren-ishii:holi.social',
      membership: MembershipStatus.join,
      name: 'O-Ren Ishii',
    }

    const members = [admin, member]

    const spaceEventContent = {
      holiSpaceId,
      roomId: spaceRoomId,
    }

    const spaceChildEventContent = {
      ...spaceEventContent,
      spaceName: spaceRoomName,
      avatarDefaultColor: '#7BD7EA',
      parentSpaceRoomId: spaceRoomId,
    }

    const spaceSharedDataEvent = createMatrixEventMock(ChatRoomEvent.SharedData, spaceRoomId, spaceEventContent, {
      content: spaceEventContent,
      getTs: jest.fn(),
    } as unknown as IEvent)

    const spaceChildSharedDataEvent = createMatrixEventMock(ChatRoomEvent.SharedData, spaceChildRoomId, {}, {
      content: spaceChildEventContent,
      getTs: jest.fn(),
    } as unknown as IEvent)

    const spaceParentEvent = createMatrixEventMock(EventType.SpaceParent, spaceChildRoomId, {}, {
      type: EventType.SpaceParent,
      sender: admin.id,
      content: { canonical: true },
      state_key: spaceRoomId,
      room_id: spaceChildRoomId,
    } as unknown as IEvent)

    const roomMockOptions = {
      members,
      timestamp,
      timelineEvents: [],
      unreadNotificationCount: notificationCount,
      creatorId: admin.id,
      getMember: admin,
      myMembership: MembershipStatus.join,
    }

    const spaceRoomMock = createRoomMock(spaceRoomId, {
      ...roomMockOptions,
      name: spaceRoomName,
      isSpaceRoom: true,
      stateEvents: [spaceSharedDataEvent],
    })

    const spaceChildRoomMock = createRoomMock(spaceChildRoomId, {
      ...roomMockOptions,
      name: spaceChildRoomName,
      stateEvents: [spaceChildSharedDataEvent, spaceParentEvent],
    })

    const rooms = [spaceRoomMock, spaceChildRoomMock]
    mxClient.getRooms.mockReturnValue(rooms)
    mxClient.getRoom.mockReturnValue(spaceRoomMock)

    const { result } = renderHook(() => useStoreRoomAtomsTest(), { wrapper })

    expect(Object.keys(result.current).length).toBe(2)
    expect(store.get(result.current[spaceRoomId])).toStrictEqual({
      type: 'space',
      avatar: undefined,
      content: spaceEventContent,
      creator: admin,
      hasInvitation: false,
      id: spaceRoomId,
      lastMessage: undefined,
      members,
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
      members,
      name: spaceChildRoomName,
      notificationCount: notificationCount,
      timestamp,
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
    const spaceRoomContent = { holiSpaceId, roomId: spaceRoomId }

    const spaceChildRoomContent = {
      holiSpaceId,
      roomId: spaceChildRoomId,
      spaceName: spaceRoomName,
      avatarDefaultColor: '#7BD7EA',
      parentSpaceRoomId: spaceRoomId,
    }

    const spaceSharedDataEvent = createMatrixEventMock(ChatRoomEvent.SharedData, spaceRoomId, spaceRoomContent, {
      content: spaceRoomContent,
    } as unknown as IEvent)

    const spaceChildSharedDataEvent = createMatrixEventMock(ChatRoomEvent.SharedData, spaceChildRoomId, undefined, {
      content: spaceChildRoomContent,
    } as unknown as IEvent)

    const spaceParentEvent = createMatrixEventMock(EventType.SpaceParent, spaceChildRoomId, undefined, {
      content: { canonical: true },
      state_key: spaceRoomId,
      room_id: spaceChildRoomId,
    } as unknown as IEvent)

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
      stateEvents: [spaceChildSharedDataEvent, spaceParentEvent],
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
      content: spaceRoomContent,
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
      content: spaceChildRoomContent,
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
