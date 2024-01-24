import { act, renderHook } from '@testing-library/react-hooks'
import { when } from 'jest-when'
import { Provider, createStore, useAtom, useAtomValue } from 'jotai'
import { ClientEvent, Room } from 'matrix-js-sdk'
import React from 'react'
import { PropsWithChildren } from 'react'

import { ChatRoomEvent, MembershipStatus } from '@holi/chat/src/client/types'
import { _roomAtomsRecordAtomSubscriber, initChatClient, roomAtomsRecordAtom } from '@holi/chat/src/store/store'
import {
  createChatClient,
  createMatrixClientMock,
  createRoomMemberMock,
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
  let store: ReturnType<typeof createStore>
  let mxClient = createMatrixClientMock()
  let chatClient = createChatClient()

  const roomId = 'roomId'
  const notificationCount = 0

  const creator = {
    avatar: 'https://unsplash.com/photos/a-black-and-white-photo-of-a-diamond-vbPk2tB2HrU',
    id: 'creator.kato:holi.social',
    membership: MembershipStatus.join,
    name: 'creator',
  }
  const member = {
    avatar: 'https://unsplash.com/photos/a-group-of-blue-and-orange-shapes-on-a-white-surface-g0lR2cThaR0',
    id: 'member1.feynman:holi.social',
    membership: MembershipStatus.join,
    name: 'member1',
  }

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

    const creatorMock = createRoomMemberMock(creator.id, creator.name, creator.membership, creator.avatar)
    const roomMock = createRoomMock(roomId, {
      members: members.map(({ avatar, id, membership, name }) => createRoomMemberMock(id, name, membership, avatar)),
      timelineEvents: [],
    })

    roomMock.getUnreadNotificationCount.mockReturnValue(notificationCount)
    roomMock.getCreator.mockReturnValue(creator.id)
    roomMock.getMember.mockReturnValue(creatorMock)
    roomMock.getMyMembership.mockReturnValue('join')

    mxClient.getRooms.mockReturnValue([roomMock])
    mxClient.roomState.mockResolvedValue([])

    const { result, waitFor } = renderHook(() => useStoreRoomAtomsTest(), { wrapper })

    // Wait until the initial rooms are available
    await waitFor(() => {
      expect(result.current).toHaveProperty(roomId)
      expect(store.get(result.current[roomId])).toStrictEqual({
        avatar: undefined,
        creator: creator,
        hasInvitation: false,
        id: roomId,
        lastMessage: undefined,
        members,
        name: undefined,
        notificationCount: notificationCount,
        timestamp: undefined,
        type: 'private',
      })
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
      },
    ]

    const spaceChildRoomEventContent = {
      holiSpaceId,
      spaceName: spaceRoomName,
      avatarDefaultColor: '#7BD7EA',
      parentSpaceRoomId: spaceRoomId,
    }

    const creatorMock = createRoomMemberMock(creator.id, creator.name, creator.membership, creator.avatar)
    const roomMembers = members.map(({ avatar, id, membership, name }) =>
      createRoomMemberMock(id, name, membership, avatar)
    )

    const roomMockOptions = {
      members: roomMembers,
      timelineEvents: [],
    }
    const spaceRoomMock = createRoomMock(spaceRoomId, roomMockOptions)
    spaceRoomMock.name = spaceRoomName
    const spaceChildRoomMock = createRoomMock(spaceChildRoomId, roomMockOptions)
    spaceChildRoomMock.name = spaceChildRoomName

    const rooms = [spaceRoomMock, spaceChildRoomMock]
    rooms.forEach((roomMock) => {
      roomMock.getUnreadNotificationCount.mockReturnValue(notificationCount)
      roomMock.getCreator.mockReturnValue(creator.id)
      roomMock.getMember.mockReturnValue(creatorMock)
      roomMock.getMyMembership.mockReturnValue('join')
    })

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

    const creatorMock = createRoomMemberMock(creator.id, creator.name, creator.membership, creator.avatar)
    const roomMock = createRoomMock(roomId, {
      members: members.map(({ avatar, id, membership, name }) => createRoomMemberMock(id, name, membership, avatar)),
      timelineEvents: [],
    })

    roomMock.getUnreadNotificationCount.mockReturnValue(notificationCount)
    roomMock.getCreator.mockReturnValue(creator.id)
    roomMock.getMember.mockReturnValue(creatorMock)

    const { result } = renderHook(() => useStoreRoomAtomsTest(), { wrapper })

    expect(result.current[roomId]).toBeUndefined()

    const listener = getListenerForMatrixEvent(ClientEvent.Room, mxClient, 'roomEventHandler') as (room: Room) => void
    act(() => listener(roomMock))

    expect(result.current).toHaveProperty(roomId)
    expect(store.get(result.current[roomId])).toStrictEqual({
      avatar: undefined,
      creator: creator,
      hasInvitation: false,
      id: roomId,
      lastMessage: undefined,
      members,
      name: undefined,
      notificationCount: notificationCount,
      timestamp: undefined,
      type: 'private',
    })
  })
})
