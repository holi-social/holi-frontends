import { ClientEvent, EventType, IEvent, MatrixEvent, Room, RoomEvent, RoomMember } from 'matrix-js-sdk'

import {
  MockTransformer,
  createMatrixClientMock,
  createMatrixEventMock,
  createRoomMock,
  getClientOptions,
  getListenerForMatrixEvent,
} from '@holi/chat/src/__tests__/helpers'
import { MutableMock } from '@holi/chat/src/__tests__/helpers/types'
import ChatClient from '@holi/chat/src/client/ChatClient'
import { ChatRoomEvent, SpaceRoom } from '@holi/chat/src/client/types'
import { createInitialRoom } from '@holi/chat/src/client/utils'

jest.mock('matrix-js-sdk')
jest.mock('@holi/chat/src/client/pusher', () => jest.fn())

describe('ChatClient', () => {
  let mxClient = createMatrixClientMock()
  beforeEach(() => {
    mxClient = createMatrixClientMock()
  })

  describe('subscribeToRooms() method', () => {
    const simulateNewRoomEvent = (room: Room) => {
      const client = new ChatClient(getClientOptions('syt_p'))
      const roomSubscriberCallback = jest.fn()
      client.subscribeToRooms(roomSubscriberCallback)

      // extract roomListener that gets set in ChatClient
      const roomListener = getListenerForMatrixEvent(ClientEvent.Room, mxClient) as (room: Room) => void
      roomListener?.(room)

      return roomSubscriberCallback
    }

    it('calls the callback handler on new event', async () => {
      const roomId = 'testRoomId'
      const room = MockTransformer.toOriginalType(createRoomMock(roomId))

      const roomSubscriberCallback = simulateNewRoomEvent(room)

      expect(roomSubscriberCallback).toBeCalledWith(createInitialRoom(room), false)
    })

    it('on a new Space room event joins that room and then calls the callback handler', async () => {
      let room = {} as Room
      mxClient.getUserId.mockReturnValue('dummy_user_id')
      mxClient.joinRoom.mockResolvedValue(room)

      const roomId = 'SpaceRoomId'
      const roomMock = createRoomMock(roomId, { isSpaceRoom: true })
      roomMock.hasMembershipState.mockReturnValue(true)
      room = MockTransformer.toOriginalType(roomMock)

      const roomSubscriberCallback = simulateNewRoomEvent(room)

      expect(mxClient.joinRoom).toBeCalledWith(roomId)
      expect(roomSubscriberCallback).toBeCalledWith(createInitialRoom(room), true)
    })
  })

  describe('subscribeToRoomDeletion() method', () => {
    it('calls the passed callback.', async () => {
      const roomId = 'roomDeletedId'
      const client = new ChatClient(getClientOptions('syt_p'))
      const roomDeletionCallback = jest.fn()
      client.subscribeToRoomDeletion(roomDeletionCallback)

      // extract roomListener that gets set in ChatClient
      const roomListener = getListenerForMatrixEvent(ClientEvent.DeleteRoom, mxClient) as (room_id: string) => void
      roomListener?.(roomId)

      expect(roomDeletionCallback).toBeCalledWith(roomId)
    })
  })

  describe('subscribeToRoomSharedData() method', () => {
    describe('subscribes to RoomSharedData events of existing rooms', () => {
      const simulateRoomSharedDataEvent = (room: MutableMock<Room>) => {
        mxClient.getRooms.mockReturnValue([MockTransformer.toOriginalType(room)])

        const client = new ChatClient(getClientOptions('syt_p'))
        const callback = jest.fn()
        client.subscribeToRoomSharedData(callback)

        // get room listener of SharedData event
        const roomListener = getListenerForMatrixEvent(RoomEvent.Timeline, room) as (
          event: MatrixEvent
        ) => Promise<void>

        return { roomListener, callback }
      }

      it('ignores non-SharedData events', async () => {
        const spaceRoom = createRoomMock('spaceRoom')
        const { roomListener, callback } = simulateRoomSharedDataEvent(spaceRoom)
        // configure event
        const nonSharedDataEvent = createMatrixEventMock(RoomEvent.MyMembership)
        // trigger event
        await roomListener(MockTransformer.toOriginalType(nonSharedDataEvent))
        expect(callback).not.toBeCalled()
      })

      it('react on SharedData event', async () => {
        const spaceRoom = createRoomMock('spaceRoom')
        const { roomListener, callback } = simulateRoomSharedDataEvent(spaceRoom)

        // configure event
        const spaceRoomSharedDataEventMock = createMatrixEventMock(ChatRoomEvent.SharedData)
        const content = { roomId: 'room', holiSpaceId: 'holi-space-id' }
        spaceRoomSharedDataEventMock.event = { content }

        // trigger event
        await roomListener(MockTransformer.toOriginalType(spaceRoomSharedDataEventMock))

        expect(callback).toBeCalledTimes(1)
        const callbackArgument: SpaceRoom = callback.mock.calls[0][0]
        expect(callbackArgument.type).toBe('space')
        expect(callbackArgument.content).toBe(content)
        expect(callbackArgument.room).toBe(spaceRoom)
      })
    })
  })

  describe('subscribeToRoomMessages() method', () => {
    const simulateMessageOrMembershipEvent = (room: MutableMock<Room>) => {
      mxClient.getRooms.mockReturnValue([MockTransformer.toOriginalType(room)])

      const client = new ChatClient(getClientOptions('syt_p'))
      const callback = jest.fn()
      client.subscribeToRoomMessages(callback)

      const roomListener = getListenerForMatrixEvent(RoomEvent.Timeline, room) as (event: MatrixEvent) => Promise<void>

      return { roomListener, callback }
    }

    it('handles Message events.', async () => {
      const roomId = 'some-room-id'
      const spaceRoom = createRoomMock(roomId)

      const { roomListener, callback } = simulateMessageOrMembershipEvent(spaceRoom)

      const messageEventMock = createMatrixEventMock(RoomEvent.Timeline)
      messageEventMock.getRoomId.mockReturnValue(roomId)
      messageEventMock.getType.mockReturnValue(EventType.RoomMessage)

      await roomListener(MockTransformer.toOriginalType(messageEventMock))

      expect(callback).toBeCalledWith(messageEventMock)
    })

    describe('handles membership', () => {
      const simulatesMembershipEvent = async (roomMembership: string, eventMembership: string) => {
        const roomId = 'some-room-id'
        const room = createRoomMock(roomId)
        room.getMember.mockReturnValue({ membership: roomMembership } as RoomMember)

        const { roomListener, callback } = simulateMessageOrMembershipEvent(room)

        const event = createMatrixEventMock(RoomEvent.Timeline)
        event.getRoomId.mockReturnValue(roomId)
        event.getType.mockReturnValue(EventType.RoomMember)
        event.getContent.mockReturnValue({ membership: eventMembership })
        event.getEffectiveEvent.mockReturnValue({ state_key: 'dummy' } as IEvent)

        await roomListener(MockTransformer.toOriginalType(event))

        return { callback, event }
      }
      it('JOIN events', async () => {
        const { callback, event } = await simulatesMembershipEvent('invite', 'join')
        expect(callback).toBeCalledWith(event)
      })

      it('LEAVE events', async () => {
        const { callback, event } = await simulatesMembershipEvent('join', 'leave')
        expect(callback).toBeCalledWith(event)
      })

      it('ignores other membership events', async () => {
        const { callback } = await simulatesMembershipEvent('knock', 'invite')
        expect(callback).not.toBeCalled()
      })
    })

    it('ignores non-message and non-membership events.', async () => {
      const eventTypesToIgnore = Object.values(EventType).filter(
        (event) => ![EventType.RoomMember, EventType.RoomMessage].includes(event)
      )

      await Promise.all(
        eventTypesToIgnore.map(async (eventType) => {
          const roomId = 'some-room-id'
          const spaceRoom = createRoomMock(roomId)

          const { roomListener, callback } = simulateMessageOrMembershipEvent(spaceRoom)

          const unsupportedEventMock = createMatrixEventMock(RoomEvent.Timeline)
          unsupportedEventMock.getRoomId.mockReturnValue(roomId)
          unsupportedEventMock.getType.mockReturnValue(eventType)

          await roomListener(MockTransformer.toOriginalType(unsupportedEventMock))

          expect(callback).not.toBeCalled()
        })
      )
    })
  })
})
