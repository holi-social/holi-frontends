import { act, renderHook } from '@testing-library/react-hooks'
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
import { type ChatRoomMember, MembershipStatus } from '@holi/chat/src/client/types'
import {
  _roomAtomsRecordAtomSubscriber,
  _spaceRoomsSubscriber,
  initChatClient,
  roomAtomsRecordAtom,
  spaceRoomIdToChildIdsAtom,
  spaceRoomIdToChildRoomsAtom,
  spaceRoomIdsAtom,
} from '@holi/chat/src/store/store'
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

const useStoreSpaceRoomAtomsTest = () => {
  const roomAtomsRecord = useAtomValue(roomAtomsRecordAtom)
  const spaceRoomIdToChildRooms = useAtomValue(spaceRoomIdToChildRoomsAtom)
  const spaceRoomIdToChildIds = useAtomValue(spaceRoomIdToChildIdsAtom)
  const spaceRoomIds = useAtomValue(spaceRoomIdsAtom)
  useAtom(_roomAtomsRecordAtomSubscriber)
  useAtom(_spaceRoomsSubscriber)
  return { roomAtomsRecord, spaceRoomIdToChildRooms, spaceRoomIdToChildIds, spaceRoomIds }
}

describe('Chat Store - space rooms', () => {
  const wrapper = ({ children }: PropsWithChildren) => <Provider store={store}>{children}</Provider>
  const roomId = 'aRoomId'
  const childRoomId = 'aChildRoomId'
  const child2RoomId = 'aChild2RoomId'
  const notificationCount = 0

  const creator: ChatRoomMember = {
    avatar: 'https://unsplash.com/photos/a-black-and-white-photo-of-a-diamond-vbPk2tB2HrU',
    id: '@creator.kato:holi.social',
    membership: MembershipStatus.join,
    name: 'creator',
  }
  const member: ChatRoomMember = {
    avatar: 'https://unsplash.com/photos/a-group-of-blue-and-orange-shapes-on-a-white-surface-g0lR2cThaR0',
    id: '@member1.feynman:holi.social',
    membership: MembershipStatus.join,
    name: 'member1',
  }
  const members = [creator, member]

  let store: ReturnType<typeof createStore>
  let mxClient: jest.MockedObjectDeep<MatrixClient>
  let chatClient: ChatClient

  beforeEach(() => {
    mxClient = createMatrixClientMock()
    chatClient = createChatClient()
    initChatClient(chatClient)
    store = createStore()
  })

  it('should add a space room for a child event', async () => {
    const roomMock = createRoomMock(roomId, {
      name: 'name',
      members,
      timestamp: undefined,
      timelineEvents: [],
      unreadNotificationCount: notificationCount,
      creatorId: creator.id,
      getMember: creator,
      myMembership: MembershipStatus.join,
    })

    const childRoomMock = createRoomMock(childRoomId, {
      name: 'childName',
      members,
      timestamp: undefined,
      timelineEvents: [],
      unreadNotificationCount: notificationCount,
      creatorId: creator.id,
      getMember: creator,
      myMembership: MembershipStatus.join,
    })

    const child2RoomMock = createRoomMock(child2RoomId, {
      name: 'child2Name',
      members,
      timestamp: undefined,
      timelineEvents: [],
      unreadNotificationCount: notificationCount,
      creatorId: creator.id,
      getMember: creator,
      myMembership: MembershipStatus.join,
    })

    mxClient.getRooms.mockReturnValue([roomMock, childRoomMock, child2RoomMock])
    mxClient.roomState.mockResolvedValue([])

    const { result } = renderHook(() => useStoreSpaceRoomAtomsTest(), { wrapper })

    const roomListener = getListenerForMatrixEvent(mxClient, ClientEvent.Room, 'roomEventHandler') as (
      room: Room
    ) => void

    act(() => roomListener(roomMock))
    act(() => roomListener(childRoomMock))
    act(() => roomListener(child2RoomMock))

    const room = createChatRoomResult(roomId, { name: 'name', creator, members })
    const childRoom = createChatRoomResult(childRoomId, { name: 'childName', creator, members })
    const child2Room = createChatRoomResult(child2RoomId, { name: 'child2Name', creator, members })

    expect(store.get(result.current.roomAtomsRecord[roomId])).toStrictEqual(room)
    expect(store.get(result.current.roomAtomsRecord[childRoomId])).toStrictEqual(childRoom)
    expect(result.current.spaceRoomIdToChildRooms).toStrictEqual({})
    expect(result.current.spaceRoomIdToChildIds).toStrictEqual({})
    expect(result.current.spaceRoomIds).toStrictEqual([])

    const spaceRoomListener = getListenerForMatrixEvent(mxClient, RoomEvent.Timeline, 'spaceRoomTimelineListener') as (
      event: MatrixEvent
    ) => void

    const spaceChildEvent = createMatrixEventMock(EventType.SpaceChild, roomId, {}, {
      room_id: roomId,
      state_key: childRoomId,
    } as IEvent)
    act(() => spaceRoomListener(spaceChildEvent))

    expect(result.current.spaceRoomIdToChildRooms).toHaveProperty(roomId)
    expect(result.current.spaceRoomIdToChildRooms[roomId].map((a) => store.get(a))).toStrictEqual([childRoom])
    expect(result.current.spaceRoomIdToChildIds).toHaveProperty(roomId)
    expect(result.current.spaceRoomIdToChildIds[roomId]).toStrictEqual([childRoomId])
    expect(result.current.spaceRoomIds).toStrictEqual([roomId])

    const spaceChild2Event = createMatrixEventMock(EventType.SpaceChild, roomId, {}, {
      room_id: roomId,
      state_key: child2RoomId,
    } as IEvent)
    act(() => spaceRoomListener(spaceChild2Event))

    expect(result.current.spaceRoomIdToChildRooms).toHaveProperty(roomId)
    expect(result.current.spaceRoomIdToChildRooms[roomId].map((a) => store.get(a))).toStrictEqual([
      childRoom,
      child2Room,
    ])
    expect(result.current.spaceRoomIdToChildIds).toHaveProperty(roomId)
    expect(result.current.spaceRoomIdToChildIds[roomId]).toStrictEqual([childRoomId, child2RoomId])
    expect(result.current.spaceRoomIds).toStrictEqual([roomId])
  })
})
