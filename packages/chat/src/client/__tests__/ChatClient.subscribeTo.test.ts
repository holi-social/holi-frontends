import {
  ClientEvent,
  EmittedEvents,
  EventEmitterEvents,
  EventType,
  IEvent,
  Room,
  RoomEvent,
  RoomMember,
} from 'matrix-js-sdk'

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
const chatAdminUserId = 'matrix-admin-user-id'
jest.mock('@holi/core/helpers/config', () => ({
  chatAdminUserId,
}))

type PickMatching<T, V> = { [K in keyof T as T[K] extends V ? K : never]: T[K] }
type ChatClientMethods = PickMatching<ChatClient, CallableFunction>

interface ClientLevelOptions {
  level: 'client'
  room?: MutableMock<Room>
}

interface RoomLevelOptions {
  level: 'room'
  room: MutableMock<Room>
}

type SimulateSubscriptionOptions = ClientLevelOptions | RoomLevelOptions

describe('ChatClient', () => {
  let mxClient = createMatrixClientMock()
  beforeEach(() => {
    mxClient = createMatrixClientMock()
  })

  const simulateSubscription = <K extends keyof ChatClientMethods>(
    subscribeMethod: K,
    eventType: EmittedEvents | EventEmitterEvents | RoomEvent,
    { level, room }: SimulateSubscriptionOptions = { level: 'client' }
  ) => {
    if (room) mxClient.getRooms.mockReturnValue([MockTransformer.toOriginalType(room)])

    const client = new ChatClient(getClientOptions('syt_p'))
    const callback = jest.fn()
    const subscriber = client[subscribeMethod] as (...args: unknown[]) => void
    subscriber.call(client, callback)

    const listener = getListenerForMatrixEvent(eventType, level === 'client' ? mxClient : room) as (
      ...args: unknown[]
    ) => void

    return { listener, callback }
  }

  describe('subscribeToNewRooms() method', () => {
    it('calls the callback handler on new event', async () => {
      const roomId = 'testRoomId'
      const room = createRoomMock(roomId)

      const { listener, callback } = simulateSubscription('subscribeToNewRooms', ClientEvent.Room)
      listener(room)

      expect(callback).toBeCalledWith(createInitialRoom(MockTransformer.toOriginalType(room)), false)
    })

    it('on a new Space room event joins that room and then calls the callback handler', async () => {
      let room = {} as Room
      mxClient.getUserId.mockReturnValue('dummy_user_id')
      mxClient.joinRoom.mockResolvedValue(room)

      const roomId = 'SpaceRoomId'
      const roomMock = createRoomMock(roomId, { isSpaceRoom: true })
      roomMock.hasMembershipState.mockReturnValue(true)
      room = MockTransformer.toOriginalType(roomMock)

      const { listener, callback } = simulateSubscription('subscribeToNewRooms', ClientEvent.Room)
      listener(room)

      expect(mxClient.joinRoom).toBeCalledWith(roomId)
      expect(callback).toBeCalledWith(createInitialRoom(room), true)
    })
  })

  describe('subscribeToRoomDeletion() method', () => {
    it('calls the passed callback.', async () => {
      const roomId = 'roomDeletedId'

      const { listener, callback } = simulateSubscription('subscribeToRoomDeletion', ClientEvent.DeleteRoom)
      listener(roomId)

      expect(callback).toBeCalledWith(roomId)
    })
  })

  describe('subscribeToRoomSharedData() method', () => {
    describe('subscribes to RoomSharedData events of existing rooms', () => {
      it('ignores non-SharedData events', async () => {
        const room = createRoomMock('spaceRoom')
        const { listener, callback } = simulateSubscription('subscribeToRoomSharedData', RoomEvent.Timeline, {
          level: 'room',
          room,
        })

        // configure event
        const nonSharedDataEvent = createMatrixEventMock(RoomEvent.MyMembership)

        // trigger event
        await listener(MockTransformer.toOriginalType(nonSharedDataEvent))

        expect(callback).not.toBeCalled()
      })

      it('react on SharedData event', async () => {
        const room = createRoomMock('spaceRoom')
        const { listener, callback } = simulateSubscription('subscribeToRoomSharedData', RoomEvent.Timeline, {
          level: 'room',
          room,
        })

        // configure event
        const spaceRoomSharedDataEventMock = createMatrixEventMock(ChatRoomEvent.SharedData)
        const content = { roomId: 'room', holiSpaceId: 'holi-space-id' }
        spaceRoomSharedDataEventMock.event = { content }

        // trigger event
        await listener(MockTransformer.toOriginalType(spaceRoomSharedDataEventMock))

        expect(callback).toBeCalledTimes(1)
        const callbackArgument: SpaceRoom = callback.mock.calls[0][0]
        expect(callbackArgument.type).toBe('space')
        expect(callbackArgument.content).toBe(content)
        expect(callbackArgument.room).toBe(room)
      })
    })
  })

  describe('subscribeToRoomMessages() method', () => {
    it('handles Message events.', async () => {
      const roomId = 'some-room-id'
      const room = createRoomMock(roomId)

      const { listener, callback } = simulateSubscription('subscribeToRoomMessages', RoomEvent.Timeline, {
        level: 'room',
        room,
      })

      const messageEventMock = createMatrixEventMock(RoomEvent.Timeline)
      messageEventMock.getRoomId.mockReturnValue(roomId)
      messageEventMock.getType.mockReturnValue(EventType.RoomMessage)

      await listener(MockTransformer.toOriginalType(messageEventMock))

      expect(callback).toBeCalledWith(messageEventMock)
    })

    describe('handles membership', () => {
      const simulatesMembershipSub = async (roomMembership: string, eventMembership: string) => {
        const roomId = 'some-room-id'
        const room = createRoomMock(roomId)
        room.getMember.mockReturnValue({ membership: roomMembership } as RoomMember)

        const { listener, callback } = simulateSubscription('subscribeToRoomMessages', RoomEvent.Timeline, {
          level: 'room',
          room,
        })

        const event = createMatrixEventMock(RoomEvent.Timeline)
        event.getRoomId.mockReturnValue(roomId)
        event.getType.mockReturnValue(EventType.RoomMember)
        event.getContent.mockReturnValue({ membership: eventMembership })
        event.getEffectiveEvent.mockReturnValue({ state_key: 'dummy' } as IEvent)

        await listener(MockTransformer.toOriginalType(event))

        return { callback, event }
      }
      it('JOIN events', async () => {
        const { callback, event } = await simulatesMembershipSub('invite', 'join')
        expect(callback).toBeCalledWith(event)
      })

      it('LEAVE events', async () => {
        const { callback, event } = await simulatesMembershipSub('join', 'leave')
        expect(callback).toBeCalledWith(event)
      })

      it('ignores other membership events', async () => {
        const { callback } = await simulatesMembershipSub('knock', 'invite')
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
          const room = createRoomMock(roomId)

          const { listener, callback } = simulateSubscription('subscribeToRoomMessages', RoomEvent.Timeline, {
            level: 'room',
            room,
          })

          const unsupportedEventMock = createMatrixEventMock(RoomEvent.Timeline)
          unsupportedEventMock.getRoomId.mockReturnValue(roomId)
          unsupportedEventMock.getType.mockReturnValue(eventType)

          await listener(MockTransformer.toOriginalType(unsupportedEventMock))

          expect(callback).not.toBeCalled()
        })
      )
    })
  })

  describe('subscribeToSpaceRooms() method', () => {
    it('handles SpaceChild event types', async () => {
      const roomId = 'some-room-id'
      const room = createRoomMock(roomId)

      // Timeline event of type SpaceChild
      const event = createMatrixEventMock(RoomEvent.Timeline)
      event.getType.mockReturnValue(EventType.SpaceChild)
      event.getEffectiveEvent.mockReturnValue({} as IEvent)

      const { listener, callback } = simulateSubscription('subscribeToSpaceRooms', RoomEvent.Timeline, {
        level: 'client',
        room,
      })
      await listener(MockTransformer.toOriginalType(event))

      expect(callback).toBeCalled()
    })

    it('ignores non-SpaceChild event types', async () => {
      const roomId = 'some-room-id'
      const room = createRoomMock(roomId)

      // Timeline event of type SpaceParent
      const event = createMatrixEventMock(RoomEvent.Timeline)
      event.getType.mockReturnValue(EventType.SpaceParent)
      event.getEffectiveEvent.mockReturnValue({} as IEvent)

      const { listener, callback } = simulateSubscription('subscribeToSpaceRooms', RoomEvent.Timeline, {
        level: 'client',
        room,
      })
      await listener(MockTransformer.toOriginalType(event))

      expect(callback).not.toBeCalled()
    })

    it('automatically joins Room for Matrix Admin`s INVITE RoomMember event type.', async () => {
      const roomId = 'some-room-id'
      const room = createRoomMock(roomId)

      const mxUserId = 'mx-user-id'
      mxClient.getUserId.mockReturnValue(mxUserId)
      mxClient.joinRoom.mockResolvedValue(MockTransformer.toOriginalType(room))
      // Timeline event of type SpaceChild
      const event = createMatrixEventMock(RoomEvent.Timeline)
      event.getType.mockReturnValue(EventType.RoomMember)
      event.getEffectiveEvent.mockReturnValue({ state_key: mxUserId } as IEvent)
      event.getSender.mockReturnValue(chatAdminUserId)
      event.getContent.mockReturnValue({ membership: 'invite' })
      event.getRoomId.mockReturnValue(roomId)

      const { listener, callback } = simulateSubscription('subscribeToSpaceRooms', RoomEvent.Timeline, {
        level: 'client',
        room,
      })
      await listener(MockTransformer.toOriginalType(event))

      // joins room
      expect(mxClient.joinRoom).toBeCalled()
      // does not call callback
      expect(callback).not.toBeCalled()
    })
  })

  describe('subscribeToUnreadRoomsNotifications() method', () => {
    it('handles UnreadNotifications events.', async () => {
      const roomId = 'some-room-id'
      const room = createRoomMock(roomId)
      const notificationCount = 3

      const { listener, callback } = simulateSubscription(
        'subscribeToUnreadRoomsNotifications',
        RoomEvent.UnreadNotifications,
        {
          level: 'room',
          room,
        }
      )

      listener(notificationCount)

      expect(callback).toBeCalledWith(roomId, notificationCount)
    })

    it('ignores UnreadNotifications event with `0` count value.', async () => {
      const room = createRoomMock('some-room-id')
      const notificationCount = 0

      const { listener, callback } = simulateSubscription(
        'subscribeToUnreadRoomsNotifications',
        RoomEvent.UnreadNotifications,
        {
          level: 'room',
          room,
        }
      )

      listener(notificationCount)

      expect(callback).not.toBeCalled()
    })
  })
})
