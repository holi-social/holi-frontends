import { renderHook } from '@testing-library/react-hooks'
import { act, waitFor } from '@testing-library/react-native'

import { Provider, createStore, useAtom, useAtomValue } from 'jotai'
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
import type { PropsWithChildren } from 'react'

import type ChatClient from '@holi/chat/src/client/ChatClient'
import { ChatRoomEvent, type ChatRoomMember, MembershipStatus } from '@holi/chat/src/client/types'
import {
  _deleteRoomAtomSubscriber,
  _roomAtomsRecordAtomSubscriber,
  initChatClient,
  roomAtomsRecordAtom,
} from '@holi/chat/src/store/store'
import {
  ADMIN_FIXTURE,
  CREATOR_FIXTURE,
  DM_MEMBERS,
  DM_ROOM_ID,
  MEMBER1_FIXTURE,
  NOTIFICATION_COUNT,
  SPACE_CHILD_EVENT_CONTENT,
  SPACE_CHILD_ROOM_ID_FIXTURE,
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

jest.mock('matrix-js-sdk')
jest.mock('@holi/chat/src/client/pusher')

const useStoreRoomAtomsTest = () => {
  const roomAtomsRecord = useAtomValue(roomAtomsRecordAtom)
  useAtom(_roomAtomsRecordAtomSubscriber)
  useAtom(_deleteRoomAtomSubscriber)
  return roomAtomsRecord
}

const convertMemberAvatar = (member: ChatRoomMember) => ({ ...member, avatar: undefined })
const convertMembersAvatar = (members: ChatRoomMember[]) => members.map(convertMemberAvatar)

describe('Chat Store - rooms', () => {
  const wrapper = ({ children }: PropsWithChildren) => <Provider store={store}>{children}</Provider>
  let mxClient: jest.MockedObjectDeep<MatrixClient>
  let chatClient: ChatClient
  let store: ReturnType<typeof createStore>

  const roomMockOptions = {
    members: DM_MEMBERS,
    name: MEMBER1_FIXTURE.name,
    timelineEvents: [],
    unreadNotificationCount: NOTIFICATION_COUNT,
    creatorId: CREATOR_FIXTURE.id,
    getMember: CREATOR_FIXTURE,
  }

  const spaceRoomMockOptions = {
    members: SPACE_MEMBERS_FIXTURE,
    timelineEvents: [],
    unreadNotificationCount: NOTIFICATION_COUNT,
    creatorId: ADMIN_FIXTURE.id,
    getMember: ADMIN_FIXTURE,
    myMembership: MembershipStatus.join,
  }

  beforeEach(() => {
    jest.clearAllTimers()
    mxClient = createMatrixClientMock()
    chatClient = createChatClient()
    store = createStore()
    initChatClient(chatClient)
  })

  it('should render the previously joined DM room', () => {
    const roomMock = createRoomMock(DM_ROOM_ID, {
      ...roomMockOptions,
      myMembership: MembershipStatus.join,
    })

    roomMock.getLastActiveTimestamp.mockReturnValue(TIMESTAMP_FIXTURE)

    mxClient.getRooms.mockReturnValue([roomMock])
    mxClient.roomState.mockResolvedValue([])

    const { result } = renderHook(() => useStoreRoomAtomsTest(), { wrapper })

    expect(result.current).toHaveProperty(DM_ROOM_ID)
    expect(store.get(result.current[DM_ROOM_ID])).toEqual(
      expect.objectContaining({
        id: DM_ROOM_ID,
        name: MEMBER1_FIXTURE.name,
        type: 'private',
        creator: convertMemberAvatar(CREATOR_FIXTURE),
        members: convertMembersAvatar(DM_MEMBERS),
        notificationCount: NOTIFICATION_COUNT,
      })
    )
  })

  it('should render the previously joined space room', () => {
    const spaceSharedDataEvent = createMatrixEventMock(
      ChatRoomEvent.SharedData,
      SPACE_ROOM_ID_FIXTURE,
      SPACE_EVENT_CONTENT,
      {
        content: SPACE_EVENT_CONTENT,
      } as unknown as IEvent
    )

    const spaceChildSharedDataEvent = createMatrixEventMock(ChatRoomEvent.SharedData, SPACE_CHILD_ROOM_ID_FIXTURE, {}, {
      content: SPACE_CHILD_EVENT_CONTENT,
    } as unknown as IEvent)

    const spaceParentEvent = createMatrixEventMock(EventType.SpaceParent, SPACE_CHILD_ROOM_ID_FIXTURE, {}, {
      type: EventType.SpaceParent,
      sender: ADMIN_FIXTURE.id,
      content: { canonical: true },
      state_key: SPACE_ROOM_ID_FIXTURE,
      room_id: SPACE_CHILD_ROOM_ID_FIXTURE,
    } as unknown as IEvent)

    const spaceRoomMock = createRoomMock(SPACE_ROOM_ID_FIXTURE, {
      ...spaceRoomMockOptions,
      name: SPACE_ROOM_NAME_FIXTURE,
      isSpaceRoom: true,
      stateEvents: [spaceSharedDataEvent],
    })

    const spaceChildRoomMock = createRoomMock(SPACE_CHILD_ROOM_ID_FIXTURE, {
      ...spaceRoomMockOptions,
      name: SPACE_CHILD_ROOM_ID_FIXTURE,
      stateEvents: [spaceChildSharedDataEvent, spaceParentEvent],
    })

    const rooms = [spaceRoomMock, spaceChildRoomMock]
    mxClient.getRooms.mockReturnValue(rooms)
    mxClient.getRoom.mockReturnValue(spaceRoomMock)

    const { result } = renderHook(() => useStoreRoomAtomsTest(), { wrapper })

    expect(Object.keys(result.current).length).toBe(2)
    expect(store.get(result.current[SPACE_ROOM_ID_FIXTURE])).toStrictEqual({
      type: 'space',
      avatar: undefined,
      content: SPACE_EVENT_CONTENT,
      creator: ADMIN_FIXTURE,
      hasInvitation: false,
      id: SPACE_ROOM_ID_FIXTURE,
      lastMessage: undefined,
      name: SPACE_ROOM_NAME_FIXTURE,
      members: convertMembersAvatar(SPACE_MEMBERS_FIXTURE),
      notificationCount: NOTIFICATION_COUNT,
      timestamp: undefined,
    })

    expect(store.get(result.current[SPACE_CHILD_ROOM_ID_FIXTURE])).toEqual(
      expect.objectContaining({
        type: 'space.child',
        avatar: undefined,
        content: SPACE_CHILD_EVENT_CONTENT,
        creator: ADMIN_FIXTURE,
        hasInvitation: false,
        id: SPACE_CHILD_ROOM_ID_FIXTURE,
        lastMessage: undefined,
        members: convertMembersAvatar(SPACE_MEMBERS_FIXTURE),
        name: SPACE_CHILD_ROOM_ID_FIXTURE,
        notificationCount: NOTIFICATION_COUNT,
      })
    )
  })

  it('should delete rooms on subscribtion and update the _roomAtomsRecordAtom', () => {
    const spaceSharedDataEvent = createMatrixEventMock(
      ChatRoomEvent.SharedData,
      SPACE_ROOM_ID_FIXTURE,
      SPACE_EVENT_CONTENT,
      {
        content: SPACE_EVENT_CONTENT,
      } as unknown as IEvent
    )

    const spaceChildSharedDataEvent = createMatrixEventMock(ChatRoomEvent.SharedData, SPACE_CHILD_ROOM_ID_FIXTURE, {}, {
      content: SPACE_CHILD_EVENT_CONTENT,
    } as unknown as IEvent)

    const spaceParentEvent = createMatrixEventMock(EventType.SpaceParent, SPACE_CHILD_ROOM_ID_FIXTURE, {}, {
      type: EventType.SpaceParent,
      content: { canonical: true },
      state_key: SPACE_ROOM_ID_FIXTURE,
      room_id: SPACE_CHILD_ROOM_ID_FIXTURE,
    } as unknown as IEvent)

    const spaceRoomMock = createRoomMock(SPACE_ROOM_ID_FIXTURE, {
      ...spaceRoomMockOptions,
      name: SPACE_ROOM_NAME_FIXTURE,
      isSpaceRoom: true,
      stateEvents: [spaceSharedDataEvent],
    })

    const spaceChildRoomMock = createRoomMock(SPACE_CHILD_ROOM_ID_FIXTURE, {
      ...spaceRoomMockOptions,
      name: SPACE_CHILD_ROOM_ID_FIXTURE,
      stateEvents: [spaceChildSharedDataEvent, spaceParentEvent],
    })

    const rooms = [spaceRoomMock, spaceChildRoomMock]
    mxClient.getRooms.mockReturnValue(rooms)
    mxClient.getRoom.mockReturnValue(spaceRoomMock)

    const { result } = renderHook(() => useStoreRoomAtomsTest(), { wrapper })

    expect(Object.keys(result.current).length).toBe(2)

    const deleteRoomListener = getListenerForMatrixEvent(mxClient, ClientEvent.DeleteRoom, 'handleRoomDeletion') as (
      roomId: string
    ) => void

    act(() => {
      deleteRoomListener(SPACE_ROOM_ID_FIXTURE)
      deleteRoomListener(SPACE_CHILD_ROOM_ID_FIXTURE)
    })

    expect(Object.keys(result.current).length).toBe(0)
    expect(() => store.get(result.current[SPACE_ROOM_ID_FIXTURE])).toThrow()
    expect(() => store.get(result.current[SPACE_CHILD_ROOM_ID_FIXTURE])).toThrow()
  })

  it('should not render DM rooms with an Empty Room name', () => {
    const dmRoomMock = createRoomMock(DM_ROOM_ID, {
      ...roomMockOptions,
      name: '',
    })

    const { result } = renderHook(() => useStoreRoomAtomsTest(), { wrapper })

    expect(result.current[DM_ROOM_ID]).toBeUndefined()

    // First DM comes in
    const newRoomListener = getListenerForMatrixEvent(mxClient, ClientEvent.Room, 'roomEventHandler') as (
      room: Room
    ) => void

    act(() => newRoomListener(dmRoomMock))

    expect(result.current[DM_ROOM_ID]).toBeUndefined()
    expect(Object.entries(result.current).length).toBe(0)
  })

  it('should subscribeToNewRooms events and update the _roomAtomsRecordAtom', async () => {
    const dmRoomMock = createRoomMock(DM_ROOM_ID, roomMockOptions)

    const { result } = renderHook(() => useStoreRoomAtomsTest(), { wrapper })

    expect(result.current[DM_ROOM_ID]).toBeUndefined()

    // First DM comes in
    const newRoomListener = getListenerForMatrixEvent(mxClient, ClientEvent.Room, 'roomEventHandler') as (
      room: Room
    ) => void

    act(() => newRoomListener(dmRoomMock))

    expect(Object.entries(result.current).length).toBe(1)
    expect(result.current).toHaveProperty(DM_ROOM_ID)
    expect(store.get(result.current[DM_ROOM_ID])).toStrictEqual({
      avatar: undefined,
      creator: convertMemberAvatar(CREATOR_FIXTURE),
      hasInvitation: false,
      id: DM_ROOM_ID,
      lastMessage: undefined,
      members: convertMembersAvatar(DM_MEMBERS),
      name: MEMBER1_FIXTURE.name,
      notificationCount: NOTIFICATION_COUNT,
      type: 'private',
      timestamp: undefined,
    })

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
      ...spaceRoomMockOptions,
      isSpaceRoom: true,
      name: SPACE_ROOM_NAME_FIXTURE,
      stateEvents: [spaceSharedDataEvent],
    })

    const spaceChildRoomMock = createRoomMock(SPACE_CHILD_ROOM_ID_FIXTURE, {
      ...spaceRoomMockOptions,
      name: SPACE_CHILD_ROOM_ID_FIXTURE,
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
    expect(store.get(result.current[SPACE_ROOM_ID_FIXTURE])).toStrictEqual({
      type: 'space',
      avatar: undefined,
      content: SPACE_EVENT_CONTENT,
      creator: ADMIN_FIXTURE,
      hasInvitation: false,
      id: SPACE_ROOM_ID_FIXTURE,
      lastMessage: undefined,
      members: convertMembersAvatar(SPACE_MEMBERS_FIXTURE),
      name: SPACE_ROOM_NAME_FIXTURE,
      notificationCount: NOTIFICATION_COUNT,
      timestamp: undefined,
    })

    expect(store.get(result.current[SPACE_CHILD_ROOM_ID_FIXTURE])).toStrictEqual({
      type: 'space.child',
      avatar: undefined,
      content: SPACE_CHILD_EVENT_CONTENT,
      creator: ADMIN_FIXTURE,
      hasInvitation: false,
      id: SPACE_CHILD_ROOM_ID_FIXTURE,
      lastMessage: undefined,
      members: convertMembersAvatar(SPACE_MEMBERS_FIXTURE),
      name: SPACE_CHILD_ROOM_ID_FIXTURE,
      notificationCount: NOTIFICATION_COUNT,
      timestamp: undefined,
    })
  })

  it('should update the space child room shared data content', async () => {
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

    const spaceParentEvent = createMatrixEventMock(EventType.SpaceParent, SPACE_CHILD_ROOM_ID_FIXTURE, {}, {
      type: EventType.SpaceParent,
      content: { canonical: true },
      state_key: SPACE_ROOM_ID_FIXTURE,
      room_id: SPACE_CHILD_ROOM_ID_FIXTURE,
    } as unknown as IEvent)

    const spaceRoomMock = createRoomMock(SPACE_ROOM_ID_FIXTURE, {
      ...spaceRoomMockOptions,
      name: SPACE_ROOM_NAME_FIXTURE,
      isSpaceRoom: true,
      stateEvents: [spaceSharedDataEvent],
    })

    const spaceChildRoomMock = createRoomMock(SPACE_CHILD_ROOM_ID_FIXTURE, {
      ...spaceRoomMockOptions,
      name: SPACE_CHILD_ROOM_ID_FIXTURE,
      stateEvents: [spaceChildSharedDataEvent, spaceParentEvent],
    })

    const rooms = [spaceRoomMock, spaceChildRoomMock]
    mxClient.getRooms.mockReturnValue(rooms)
    mxClient.getRoom.mockReturnValue(spaceRoomMock)

    const { result } = renderHook(() => useStoreRoomAtomsTest(), { wrapper })

    expect(Object.keys(result.current).length).toBe(2)
    expect(store.get(result.current[SPACE_ROOM_ID_FIXTURE])).toEqual(
      expect.objectContaining({ content: SPACE_EVENT_CONTENT })
    )
    expect(store.get(result.current[SPACE_CHILD_ROOM_ID_FIXTURE])).toEqual(
      expect.objectContaining({ content: SPACE_CHILD_EVENT_CONTENT })
    )

    // Subscribe to new Shared Data Events
    const newSpaceName = 'TestLink Hub'
    const newSpaceChildSharedDataEvent = createMatrixEventMock(
      ChatRoomEvent.SharedData,
      SPACE_CHILD_ROOM_ID_FIXTURE,
      undefined,
      {
        content: {
          ...SPACE_CHILD_EVENT_CONTENT,
          spaceName: newSpaceName,
        },
      } as unknown as IEvent
    )
    const newSpaceChildRoomMock = createRoomMock(SPACE_CHILD_ROOM_ID_FIXTURE, {
      ...spaceRoomMockOptions,
      name: SPACE_CHILD_ROOM_ID_FIXTURE,
      stateEvents: [newSpaceChildSharedDataEvent, spaceParentEvent],
    })

    const sharedDataListener = getListenerForMatrixEvent(mxClient, RoomEvent.Timeline, 'handleSharedData') as (
      event: MatrixEvent,
      room: Room | undefined
    ) => void

    await waitFor(() => {
      act(() => {
        sharedDataListener(newSpaceChildSharedDataEvent, newSpaceChildRoomMock)
      })
    })

    expect(store.get(result.current[SPACE_CHILD_ROOM_ID_FIXTURE])).toEqual(
      expect.objectContaining({
        content: {
          ...SPACE_CHILD_EVENT_CONTENT,
          spaceName: newSpaceName,
        },
      })
    )
  })
})
