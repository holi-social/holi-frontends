import { act, renderHook } from '@testing-library/react-hooks'
import { when } from 'jest-when'
import { Provider, createStore, useAtom, useAtomValue } from 'jotai'
import { ClientEvent, MatrixClient, Room } from 'matrix-js-sdk'
import React from 'react'
import { PropsWithChildren } from 'react'

import ChatClient from '@holi/chat/src/client/ChatClient'
import { ChatRoomEvent, ChatRoomMember, MembershipStatus } from '@holi/chat/src/client/types'
import { _roomAtomsRecordAtomSubscriber, initChatClient, roomAtomsRecordAtom } from '@holi/chat/src/store/store'
import {
  createChatClient,
  createChatRoom,
  createMatrixClientMock,
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
  const roomId = 'roomId'
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

  let mxClient: jest.MockedObjectDeep<MatrixClient>
  let chatClient: ChatClient
  let store: ReturnType<typeof createStore>

  beforeEach(() => {
    jest.clearAllTimers()
    mxClient = createMatrixClientMock()
    chatClient = createChatClient()
    initChatClient(chatClient)
    store = createStore()
  })

  it('should rendered the previously joined private room - getJoinedRoomsWithSharedData', async () => {
    // Init test Data
    const members = [creator, member]

    const roomMock = createRoomMock(roomId, {
      name: 'name',
      members,
      timelineEvents: [],
      unreadNotificationCount: notificationCount,
      creatorId: creator.id,
      myMembership: MembershipStatus.join,
      getMember: creator,
    })

    mxClient.getRooms.mockReturnValue([roomMock])
    mxClient.roomState.mockResolvedValue([])

    const { result, waitFor } = renderHook(() => useStoreRoomAtomsTest(), { wrapper })

    // Wait until the initial rooms are available
    await waitFor(() => {
      expect(result.current).toHaveProperty(roomId)
      expect(store.get(result.current[roomId])).toStrictEqual(
        createChatRoom(roomId, 'name', creator, members, notificationCount)
      )
    })
  })

  it('should rendered the previously joined space room - getJoinedRoomsWithSharedData', async () => {
    // Init test Data
    const spaceRoomId = '!space.room:holi.social'
    const spaceRoomName = 'space'
    const spaceChildRoomId = '!general.holi.social'
    const spaceChildRoomName = '#general'
    const holiSpaceId = 'holi-uuid'

    const members = [
      creator,
      member,
      {
        avatar: 'https://unsplash.com/test',
        id: '@o-ren-ishii:holi.social',
        membership: MembershipStatus.join,
        name: 'O-Ren Ishii',
      } as ChatRoomMember,
    ]

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
      creatorId: creator.id,
      getMember: creator,
      myMembership: MembershipStatus.join,
    }
    const spaceRoomMock = createRoomMock(spaceRoomId, roomMockOptions)
    spaceRoomMock.name = spaceRoomName
    const spaceChildRoomMock = createRoomMock(spaceChildRoomId, roomMockOptions)
    spaceChildRoomMock.name = spaceChildRoomName

    const rooms = [spaceRoomMock, spaceChildRoomMock]

    mxClient.getRooms.mockReturnValue(rooms)
    when(mxClient.roomState)
      .calledWith(spaceChildRoomId)
      .mockResolvedValue([
        {
          type: ChatRoomEvent.SharedData,
          room_id: spaceChildRoomId,
          sender: creator.id,
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
          sender: creator.id,
          content: { holiSpaceId },
          state_key: '',
          origin_server_ts: 1701872060015,
          event_id: '$HpOGhRhXpmnIqG9LzfilcVeIaY-cUQgEy2cp8d3L3io',
        },
      ])

    // Mount and test
    const { result, waitFor } = renderHook(() => useStoreRoomAtomsTest(), { wrapper })

    // Wait until the initial rooms are available
    await waitFor(() => {
      expect(Object.keys(result.current).length).toBe(2)

      expect(store.get(result.current[spaceRoomId])).toStrictEqual({
        type: 'space',
        avatar: undefined,
        content: { roomId: spaceRoomId, holiSpaceId },
        creator: creator,
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
        creator: creator,
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

  it('should subscribeToNewRooms events and update the _roomAtomsRecordAtom', () => {
    // Init test Data
    const members = [creator, member]

    const roomMock = createRoomMock(roomId, {
      name: 'name',
      members,
      timelineEvents: [],
      unreadNotificationCount: notificationCount,
      creatorId: creator.id,
      getMember: creator,
    })

    const { result } = renderHook(() => useStoreRoomAtomsTest(), { wrapper })

    expect(result.current[roomId]).toBeUndefined()

    const listener = getListenerForMatrixEvent(mxClient, ClientEvent.Room, 'roomEventHandler') as (room: Room) => void
    act(() => listener(roomMock))

    expect(result.current).toHaveProperty(roomId)
    expect(store.get(result.current[roomId])).toStrictEqual(
      createChatRoom(roomId, 'name', creator, members, notificationCount)
    )
  })
})
