import {
  EventType,
  IRoomEvent,
  IStateEvent,
  IStateEventWithRoomId,
  Preset,
  ReceiptType,
  Visibility,
} from 'matrix-js-sdk'

import {
  createMatrixClientMock,
  createMatrixEventMock,
  createRoomMemberMock,
  createRoomMock,
  getClientOptions,
} from '@holi/chat/src/__tests__/helpers'
import ChatClient from '@holi/chat/src/client/ChatClient'
import { ChatRoomEvent, MembershipStatus } from '@holi/chat/src/client/types'
import { CHAT_ROOM_NAME_MOCK } from '@holi/chat/src/test-utils/matrix-mock-setup'
import { HoliChatClientError } from '@holi/core/errors/classes/HoliChatClientError'

jest.mock('matrix-js-sdk')
jest.mock('@holi/chat/src/client/pusher', () => jest.fn())

describe('ChatClient', () => {
  let mxClient = createMatrixClientMock()
  let client: ChatClient = {} as ChatClient
  beforeEach(() => {
    mxClient = createMatrixClientMock()
    client = new ChatClient(getClientOptions('syt_p'))
  })

  const members = ['david.m.rosen', 'fusajiro.yamauchi']

  describe('createRoom() method', () => {
    it('create a direct message room', async () => {
      mxClient.createRoom.mockResolvedValue({ room_id: CHAT_ROOM_NAME_MOCK })

      const isDM = true

      const { room_id } = await client.createRoom(members, { isDirectMessage: isDM })

      expect(room_id).toEqual(CHAT_ROOM_NAME_MOCK)
      expect(mxClient.createRoom).toBeCalledTimes(1)
      expect(mxClient.createRoom).toHaveBeenLastCalledWith({
        invite: members,
        is_direct: isDM,
        preset: 'private_chat',
        visibility: 'private',
        initial_state: [
          {
            type: 'm.room.guest_access',
            state_key: 'dm_room',
            content: {
              guest_access: 'can_join',
            },
          },
        ],
      })
    })

    it('create a group 1:n room', async () => {
      mxClient.createRoom.mockResolvedValue({ room_id: CHAT_ROOM_NAME_MOCK })

      const isDirectMessage = false
      const name = '#general'

      const { room_id } = await client.createRoom(members, { isDirectMessage, name })
      expect(room_id).toEqual(CHAT_ROOM_NAME_MOCK)
      expect(mxClient.createRoom).toBeCalledTimes(1)
      expect(mxClient.createRoom).toHaveBeenLastCalledWith({
        invite: members,
        is_direct: isDirectMessage,
        preset: Preset.PrivateChat,
        visibility: Visibility.Private,
        name,
      })
    })

    it('fails if no user IDs were passed', async () => {
      mxClient.createRoom.mockResolvedValue({ room_id: CHAT_ROOM_NAME_MOCK })

      const members: string[] = []
      const isDirectMessage = true

      expect(client.createRoom(members, { isDirectMessage })).rejects.toThrowError(HoliChatClientError)
    })
  })

  describe('getOrCreateRoom() method', () => {
    describe('creates a new room if', () => {
      const checkIfANewRoomWasCreated = async () => {
        await client.getOrCreateRoom(members, { isDirectMessage: true })

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
          members: roomMemberMocks,
        })
        mxClient.getRooms.mockReturnValue([roomMock])

        await checkIfANewRoomWasCreated()
      })

      it('client has rooms only with different members', async () => {
        const roomMemberMocks = members
          .slice(0, 1)
          .concat('some-different-user')
          .map((userId) => createRoomMemberMock(userId))
        const roomId = 'testRoomId'
        const roomMock = createRoomMock(roomId, {
          members: roomMemberMocks,
        })
        mxClient.getRooms.mockReturnValue([roomMock])

        await checkIfANewRoomWasCreated()
      })
    })

    it('finds an existing room and returns it.', async () => {
      const roomMemberMocks = members.map((userId) => createRoomMemberMock(userId))
      const roomId = 'testRoomId'
      const roomMock = createRoomMock(roomId, { members: roomMemberMocks })
      mxClient.getRooms.mockReturnValue([roomMock])

      const { room_id } = await client.getOrCreateRoom([members[0]], { isDirectMessage: true })
      expect(room_id).toEqual(roomId)
      expect(mxClient.createRoom).not.toBeCalled()
    })
  })

  describe('getJoinedRoomsWithSharedData() method', () => {
    it('empty room gives empty result', async () => {
      const roomId = 'testRoomId'
      const mockRoom = createRoomMock(roomId)
      mxClient.getRooms.mockReturnValue([mockRoom])

      const client = new ChatClient(getClientOptions('syt_p'))
      const roomWithShareData = await client.getJoinedRoomsWithSharedData()

      expect(roomWithShareData).toStrictEqual([])
    })

    it('only rooms with join or invite membership status are returned', async () => {
      const joinRoomId = 'testRoomIdJoin'
      const mockRoomJoin = createRoomMock(joinRoomId)
      mockRoomJoin.getMyMembership.mockReturnValue(MembershipStatus.join)

      const joinChildRoomId = 'testRoomIdJoin'
      const mockRoomJoinChild = createRoomMock(joinChildRoomId)
      mockRoomJoinChild.getMyMembership.mockReturnValue(MembershipStatus.join)

      const mockRoomInvite = createRoomMock('testRoomIdInvite')
      mockRoomInvite.getMyMembership.mockReturnValue(MembershipStatus.invite)

      const mockRoomOther = createRoomMock('testRoomIdOther')
      mockRoomOther.getMyMembership.mockReturnValue(MembershipStatus.leave)

      mxClient.getRooms.mockReturnValue([mockRoomJoin, mockRoomJoinChild, mockRoomInvite, mockRoomOther])

      mxClient.roomState.mockReturnValueOnce(
        Promise.resolve([
          {
            room_id: joinRoomId,
            type: ChatRoomEvent.SharedData,
            content: { holiSpaceId: 'bla' },
          } as unknown as IStateEventWithRoomId,
        ])
      )
      mxClient.roomState.mockReturnValueOnce(
        Promise.resolve([
          {
            room_id: joinChildRoomId,
            type: ChatRoomEvent.SharedData,
            content: { holiSpaceId: 'bla', parentSpaceRoomId: 'parentId', spaceName: 'spaceName' },
          } as unknown as IStateEventWithRoomId,
        ])
      )

      const client = new ChatClient(getClientOptions('syt_p'))
      const roomWithShareData = await client.getJoinedRoomsWithSharedData()

      expect(roomWithShareData).toStrictEqual([
        { room: mockRoomJoin, type: 'space', content: { holiSpaceId: 'bla', roomId: joinRoomId } },
        {
          room: mockRoomJoinChild,
          type: 'space.child',
          content: {
            roomId: joinChildRoomId,
            holiSpaceId: 'bla',
            spaceName: 'spaceName',
            avatarDefaultColor: undefined,
            parentSpaceRoomId: 'parentId',
          },
        },
        { room: mockRoomInvite, type: 'private' },
      ])
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
      expect(mockRoom.hasMembershipState).toBeCalledWith(userId, MembershipStatus.invite)
    })

    it('Event with no notify has no pending invitation', async () => {
      const mockEvent = createMatrixEventMock('any', { membership: MembershipStatus.invite })
      const result = client.hasPendingInvitation(mockEvent)
      expect(result).toBe(false)
    })

    it('Event that is sending has no pending invitation', async () => {
      const mockEvent = createMatrixEventMock('any', { membership: MembershipStatus.invite })
      mockEvent.getPushActions.mockReturnValue({ notify: true, tweaks: {} })
      mockEvent.isSending.mockReturnValue(true)
      const result = client.hasPendingInvitation(mockEvent)
      expect(result).toBe(false)
    })

    it('Event with status join has no pending invitation', async () => {
      const mockEvent = createMatrixEventMock('any', { membership: MembershipStatus.join })
      mockEvent.getPushActions.mockReturnValue({ notify: true, tweaks: {} })
      const result = client.hasPendingInvitation(mockEvent)
      expect(result).toBe(false)
    })

    it('Event with status invite has a pending invitation', async () => {
      const mockEvent = createMatrixEventMock('any', { membership: MembershipStatus.invite })
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

      expect(mxClient.sendReadReceipt).not.toBeCalled()
    })

    it('A read receipt for the last event is sent', async () => {
      const roomId = 'roomId'
      const e1 = createMatrixEventMock('any')
      const e2 = createMatrixEventMock('other')
      const mockRoom = createRoomMock(roomId, { timelineEvents: [e1, e2] })
      mxClient.getRoom.mockReturnValue(mockRoom)

      client.setLatestMessagesAsRead(roomId)

      expect(mxClient.sendReadReceipt).toBeCalledWith(e2, ReceiptType.ReadPrivate)
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
      mxClient.createMessagesRequest.mockReturnValue(Promise.resolve({ chunk, start, end }))
      const { chunk: result, ...other } = await client.createMessagesRequest(roomId)
      expect(result).toStrictEqual([eventJoin, eventLeave, eventMessage, eventWithMembershipChange])
      expect(other).toStrictEqual({ start, end })
    })
  })
})
