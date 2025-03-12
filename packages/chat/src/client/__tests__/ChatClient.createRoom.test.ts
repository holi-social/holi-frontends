import {
  EventType,
  type IEvent,
  type IRoomEvent,
  type IStateEvent,
  type MatrixClient,
  type MatrixEvent,
  Preset,
  ReceiptType,
  Visibility,
} from 'matrix-js-sdk'

import type ChatClient from '@holi/chat/src/client/ChatClient'
import { ChatRoomEvent, type MatrixId, MembershipStatus } from '@holi/chat/src/client/types'
import {
  DM_ROOM_ID,
  createChatClient,
  createMatrixClientMock,
  createMatrixEventMock,
  createRoomMemberMock,
  createRoomMock,
} from '@holi/chat/src/test-utils'
import { HoliChatClientError } from '@holi/core/errors/classes/HoliChatClientError'

jest.mock('matrix-js-sdk')
jest.mock('@holi/chat/src/client/pusher', () => jest.fn())

describe('ChatClient', () => {
  const members: MatrixId[] = ['@david.m.rosen:holi.social', '@fusajiro.yamauchi:holi.social']

  let mxClient: jest.MockedObjectDeep<MatrixClient>
  let client: ChatClient

  beforeEach(() => {
    mxClient = createMatrixClientMock()
    client = createChatClient()
  })

  describe('createRoom() method', () => {
    it('create a direct message room', async () => {
      mxClient.createRoom.mockResolvedValue({ room_id: DM_ROOM_ID })

      const isDM = true

      const { room_id } = await client.createRoom(members, { isDirectMessage: isDM, metadata: { type: 'private' } })

      expect(room_id).toEqual(DM_ROOM_ID)
      expect(mxClient.createRoom).toHaveBeenCalledTimes(1)
      expect(mxClient.createRoom).toHaveBeenLastCalledWith({
        invite: members,
        is_direct: isDM,
        preset: 'private_chat',
        visibility: 'private',
        creation_content: {
          type: 'private',
        },
      })
    })

    it('create a group 1:n room', async () => {
      mxClient.createRoom.mockResolvedValue({ room_id: DM_ROOM_ID })

      const isDirectMessage = false
      const name = '#general'

      const { room_id } = await client.createRoom(members, { isDirectMessage, name, metadata: { type: 'private' } })
      expect(room_id).toEqual(DM_ROOM_ID)
      expect(mxClient.createRoom).toHaveBeenCalledTimes(1)
      expect(mxClient.createRoom).toHaveBeenLastCalledWith({
        invite: members,
        is_direct: isDirectMessage,
        preset: Preset.PrivateChat,
        visibility: Visibility.Private,
        name,
        creation_content: {
          type: 'private',
        },
      })
    })

    it('fails if no user IDs were passed', async () => {
      mxClient.createRoom.mockResolvedValue({ room_id: DM_ROOM_ID })

      const members: string[] = []
      const isDirectMessage = true

      expect(client.createRoom(members, { isDirectMessage, metadata: { type: 'private' } })).rejects.toThrowError(
        HoliChatClientError
      )
    })
  })

  describe('getOrCreateRoom() method', () => {
    describe('creates a new room if', () => {
      const checkIfANewRoomWasCreated = async () => {
        await client.getOrCreateRoom(members, { isDirectMessage: true, metadata: { type: 'private' } })

        expect(mxClient.createRoom).toHaveBeenCalled()
      }

      it('client has no rooms at all', async () => {
        mxClient.getRooms.mockReturnValue([])

        await checkIfANewRoomWasCreated()
      })

      it('client has only Space rooms', async () => {
        const roomMemberMocks = members.map((userId) => createRoomMemberMock(userId))
        const roomId = 'testRoomId'
        const roomMock = createRoomMock(roomId, {
          isSpaceRoom: true,
          memberMocks: roomMemberMocks,
        })
        mxClient.getRooms.mockReturnValue([roomMock])

        await checkIfANewRoomWasCreated()
      })

      it('client has rooms only with different members', async () => {
        const roomMemberMocks = members
          .slice(0, 1)
          .concat('@some-different-user:holi.social')
          .map((userId) => createRoomMemberMock(userId))
        const roomId = 'testRoomId'
        const roomMock = createRoomMock(roomId, {
          memberMocks: roomMemberMocks,
        })
        mxClient.getRooms.mockReturnValue([roomMock])

        await checkIfANewRoomWasCreated()
      })
    })

    it('finds an existing room and returns it.', async () => {
      const roomMemberMocks = members.map((userId) => createRoomMemberMock(userId))
      const roomId = 'testRoomId'
      const createEvent = createMatrixEventMock(EventType.RoomCreate, roomId, { type: 'private' })
      const roomMock = createRoomMock(roomId, {
        memberMocks: roomMemberMocks,
        timelineEvents: [],
        stateEvents: [createEvent],
      })
      mxClient.getRooms.mockReturnValue([roomMock])

      const { room_id } = await client.getOrCreateRoom([members[0]], {
        isDirectMessage: true,
        metadata: { type: 'private' },
      })
      expect(room_id).toEqual(roomId)
      expect(mxClient.createRoom).not.toHaveBeenCalled()
    })
  })

  describe('getChatRooms() method', () => {
    it('should return an empty chat room array', () => {
      mxClient.getRooms.mockReturnValue([])

      const chatRooms = client.getChatRooms()

      expect(chatRooms).toStrictEqual([])
    })

    it('should return a private chat room', () => {
      const timelineEvents = [] as MatrixEvent[]
      const joinRoomId = 'testRoomIdJoin'
      const mockRoomJoin = createRoomMock(joinRoomId, { timelineEvents })
      mockRoomJoin.getMyMembership.mockReturnValue(MembershipStatus.join)

      mxClient.getRooms.mockReturnValue([mockRoomJoin])

      const chatRooms = client.getChatRooms()

      expect(chatRooms).toStrictEqual([
        {
          avatar: undefined,
          creator: null,
          hasInvitation: false,
          id: 'testRoomIdJoin',
          lastMessage: undefined,
          members: [],
          name: undefined,
          notificationCount: 0,
          timestamp: undefined,
          type: 'private',
        },
      ])
    })

    it('should return a space room with its child', () => {
      const spaceName = 'holi space name'
      const spaceChildName = '#general'
      const spaceRoomId = 'spaceId'
      const spaceChildRoomId = 'childId'
      const holiSpaceId = 'holi-space-uuid'
      const timelineEvents = [] as MatrixEvent[]
      const notificationCount = 0

      const spaceEventContent = {
        roomId: spaceRoomId,
        holiSpaceId: holiSpaceId,
      }

      const spaceChildEventContent = {
        ...spaceEventContent,
        spaceName,
        avatarDefaultColor: '',
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

      const spaceParentEvent = createMatrixEventMock(EventType.SpaceParent, spaceChildRoomId, {}, {
        type: EventType.SpaceParent,
        content: { canonical: true },
        state_key: spaceRoomId,
        room_id: spaceChildRoomId,
      } as unknown as IEvent)

      const spaceRoomMock = createRoomMock(spaceRoomId, {
        timelineEvents,
        timestamp: undefined,
        name: spaceName,
        isSpaceRoom: true,
        stateEvents: [spaceSharedDataEvent],
      })

      const spaceChildRoomMock = createRoomMock(spaceChildRoomId, {
        timelineEvents,
        timestamp: undefined,
        name: spaceChildName,
        stateEvents: [spaceChildSharedDataEvent, spaceParentEvent],
      })

      const rooms = [spaceRoomMock, spaceChildRoomMock]

      rooms.forEach((room) => {
        room.getMyMembership.mockReturnValue(MembershipStatus.join)
        room.getUnreadNotificationCount.mockReturnValue(notificationCount)
      })

      mxClient.getRooms.mockReturnValue(rooms)

      const chatRooms = client.getChatRooms()

      expect(chatRooms.length).toBe(2)

      expect(chatRooms[0]).toStrictEqual({
        id: spaceRoomId,
        type: 'space',
        avatar: undefined,
        creator: null,
        content: spaceEventContent,
        hasInvitation: false,
        lastMessage: undefined,
        members: [],
        name: spaceName,
        notificationCount: notificationCount,
        timestamp: undefined,
      })

      expect(chatRooms[1]).toStrictEqual({
        id: spaceChildRoomId,
        type: 'space.child',
        avatar: undefined,
        creator: null,
        content: spaceChildEventContent,
        hasInvitation: false,
        lastMessage: undefined,
        members: [],
        name: spaceChildName,
        notificationCount: notificationCount,
        timestamp: undefined,
      })
    })
  })

  describe('hasPendingInvitation() method', () => {
    it('For room gets MembershipState from room', async () => {
      const roomId = 'roomId'
      const userId = 'userId'
      mxClient.getUserId.mockReturnValue(userId)
      const mockRoom = createRoomMock(roomId)
      mockRoom.hasMembershipState.mockReturnValue(false)
      const result = client.hasPendingInvitation(mockRoom)
      expect(result).toBe(false)
      expect(mockRoom.hasMembershipState).toHaveBeenCalledWith(userId, MembershipStatus.invite)
    })

    it('Event with no notify has no pending invitation', async () => {
      const mockEvent = createMatrixEventMock('any', 'roomId', { membership: MembershipStatus.invite })
      const result = client.hasPendingInvitation(mockEvent)
      expect(result).toBe(false)
    })

    it('Event that is sending has no pending invitation', async () => {
      const mockEvent = createMatrixEventMock('any', 'roomId', { membership: MembershipStatus.invite })
      mockEvent.getPushActions.mockReturnValue({ notify: true, tweaks: {} })
      mockEvent.isSending.mockReturnValue(true)
      const result = client.hasPendingInvitation(mockEvent)
      expect(result).toBe(false)
    })

    it('Event with status join has no pending invitation', async () => {
      const mockEvent = createMatrixEventMock('any', 'roomId', { membership: MembershipStatus.join })
      mockEvent.getPushActions.mockReturnValue({ notify: true, tweaks: {} })
      const result = client.hasPendingInvitation(mockEvent)
      expect(result).toBe(false)
    })

    it('Event with status invite has a pending invitation', async () => {
      const mockEvent = createMatrixEventMock('any', 'roomId', { membership: MembershipStatus.invite })
      mockEvent.getPushActions.mockReturnValue({ notify: true, tweaks: {} })
      const result = client.hasPendingInvitation(mockEvent)
      expect(result).toBe(true)
    })
  })

  describe('setLatestMessagesAsRead() method', () => {
    it('nothing to do when there are no unread notifications', async () => {
      const roomId = 'roomId'
      const mockRoom = createRoomMock(roomId)
      mockRoom.getUnreadNotificationCount.mockReturnValue(0)
      mxClient.getRoom.mockReturnValue(mockRoom)

      client.setLatestMessagesAsRead(roomId)

      expect(mxClient.sendReadReceipt).not.toHaveBeenCalled()
    })

    it('A read receipt for the last event is sent', async () => {
      const roomId = 'roomId'
      const e1 = createMatrixEventMock('any')
      const e2 = createMatrixEventMock('other')
      const mockRoom = createRoomMock(roomId, { timelineEvents: [e1, e2], unreadNotificationCount: 2 })
      mxClient.getRoom.mockReturnValue(mockRoom)

      client.setLatestMessagesAsRead(roomId)

      expect(mxClient.sendReadReceipt).toHaveBeenCalledWith(e2, ReceiptType.ReadPrivate)
    })
  })

  describe('createMessagesRequest() method', () => {
    it('test filtering of messages', async () => {
      const roomId = 'roomId'
      const start = 'start'
      const end = 'end'
      const eventJoin = { type: EventType.RoomMember, content: { membership: MembershipStatus.join } } as IRoomEvent // join are kept
      const eventLeave = { type: EventType.RoomMember, content: { membership: MembershipStatus.leave } } as IRoomEvent // leave are kept
      const eventKnock = { type: EventType.RoomMember, content: { membership: MembershipStatus.knock } } as IRoomEvent // only join and leave are kept
      const eventMessage = { type: EventType.RoomMessage } as IRoomEvent // Messages are always kept
      const eventWithoutMembershipChange = {
        type: EventType.RoomMember,
        content: { membership: MembershipStatus.leave },
        prev_content: { membership: MembershipStatus.leave }, // events without a membership change are removed
      } as IStateEvent
      const eventWithMembershipChange = {
        type: EventType.RoomMember,
        content: { membership: MembershipStatus.join },
        prev_content: { membership: MembershipStatus.leave }, // event with a membership change are kept
      } as IStateEvent
      const chunk: IRoomEvent[] = [
        eventJoin,
        eventLeave,
        eventKnock,
        eventMessage,
        eventWithoutMembershipChange,
        eventWithMembershipChange,
      ]
      mxClient.createMessagesRequest.mockResolvedValue({ chunk, start, end })
      const { chunk: result, ...other } = await client.createMessagesRequest(roomId)
      expect(result).toStrictEqual([eventJoin, eventLeave, eventMessage, eventWithMembershipChange])
      expect(other).toStrictEqual({ start, end })
    })
  })
})
