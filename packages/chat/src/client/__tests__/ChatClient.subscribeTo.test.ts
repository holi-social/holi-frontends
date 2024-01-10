import {
  ClientEvent,
  EmittedEvents,
  EventEmitterEvents,
  EventType,
  IContent,
  IEvent,
  Room,
  RoomEvent,
  RoomMember,
  RoomStateEvent,
} from 'matrix-js-sdk'

import {
  createMatrixClientMock,
  createMatrixEventMock,
  createRoomMemberMock,
  createRoomMock,
  createRoomStateMock,
  getClientOptions,
  getListenerForMatrixEvent,
} from '@holi/chat/src/__tests__/helpers'
import ChatClient from '@holi/chat/src/client/ChatClient'
import { ChatRoomEvent, MembershipStatus, RoomUpdatesType, SpaceRoom } from '@holi/chat/src/client/types'
import { createChatMessage, createInitialRoom } from '@holi/chat/src/client/utils'

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
  room?: jest.Mocked<Room>
}

interface RoomLevelOptions {
  level: 'room'
  room: jest.Mocked<Room>
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
    if (room) mxClient.getRooms.mockReturnValue([room])

    const client = new ChatClient(getClientOptions('syt_p'))
    const callback = jest.fn()
    const subscriber = client[subscribeMethod] as (...args: unknown[]) => void
    subscriber.call(client, callback)

    const listener = getListenerForMatrixEvent(eventType, level === 'client' ? mxClient : room) as (
      ...args: unknown[]
    ) => Promise<void>

    return { listener, callback }
  }

  describe('subscribeToNewRooms() method', () => {
    it('calls the callback handler on new event', async () => {
      const roomId = 'testRoomId'
      const room = createRoomMock(roomId)

      const { listener, callback } = simulateSubscription('subscribeToNewRooms', ClientEvent.Room)
      await listener(room)

      expect(callback).toBeCalledWith(createInitialRoom(room), false)
    })

    it('on a new Space room event joins that room and then calls the callback handler', async () => {
      const room = {} as Room
      mxClient.getUserId.mockReturnValue('dummy_user_id')
      mxClient.joinRoom.mockResolvedValue(room)

      const roomId = 'SpaceRoomId'
      const roomMock = createRoomMock(roomId, { isSpaceRoom: true })
      roomMock.hasMembershipState.mockReturnValue(true)

      const { listener, callback } = simulateSubscription('subscribeToNewRooms', ClientEvent.Room)
      await listener(roomMock)

      expect(mxClient.joinRoom).toBeCalledWith(roomId)
      expect(callback).toBeCalledWith(createInitialRoom(roomMock), true)
    })
  })

  describe('subscribeToRoomDeletion() method', () => {
    it('calls the passed callback.', async () => {
      const roomId = 'roomDeletedId'

      const { listener, callback } = simulateSubscription('subscribeToRoomDeletion', ClientEvent.DeleteRoom)
      await listener(roomId)

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
        await listener(nonSharedDataEvent)

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
        await listener(spaceRoomSharedDataEventMock)

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
        level: 'client',
        room,
      })

      const effectiveEvent = {
        state_key: 'dummy',
        event_id: 'id',
        type: EventType.RoomMessage,
        sender: '@holi-chat:some-dude',
        origin_server_ts: 1111111,
        content: {
          body: 'howdy',
          msgtype: 'm.text',
        } as IContent,
      } as IEvent
      const messageEventMock = createMatrixEventMock(RoomEvent.Timeline)
      messageEventMock.getRoomId.mockReturnValue(roomId)
      messageEventMock.getType.mockReturnValue(EventType.RoomMessage)
      messageEventMock.getEffectiveEvent.mockReturnValue(effectiveEvent)

      await listener(messageEventMock, room)

      expect(callback).toBeCalledWith(roomId, createChatMessage(roomId, effectiveEvent))
    })

    describe('handles membership', () => {
      const simulatesMembershipSub = async (roomMembership: string, eventMembership: string) => {
        const roomId = 'some-room-id'
        const room = createRoomMock(roomId)
        room.getMember.mockReturnValue({ membership: roomMembership } as RoomMember)

        const { listener, callback } = simulateSubscription('subscribeToRoomMessages', RoomEvent.Timeline, {
          level: 'client',
          room,
        })

        const effectiveEvent = {
          state_key: 'dummy',
          event_id: 'id',
          type: EventType.RoomMember,
          sender: '@holi-admin:',
          origin_server_ts: 1111111,
          content: {
            membership: eventMembership,
          } as IContent,
        } as IEvent
        const event = createMatrixEventMock(RoomEvent.Timeline)
        event.getRoomId.mockReturnValue(roomId)
        event.getType.mockReturnValue(EventType.RoomMember)
        event.getContent.mockReturnValue({ membership: eventMembership })
        event.getEffectiveEvent.mockReturnValue(effectiveEvent)

        await listener(event, room)

        return { callback, roomId, message: createChatMessage(roomId, effectiveEvent) }
      }
      it('JOIN events', async () => {
        const { callback, message, roomId } = await simulatesMembershipSub('invite', 'join')
        expect(callback).toBeCalledWith(roomId, message)
      })

      it('LEAVE events', async () => {
        const { callback, message, roomId } = await simulatesMembershipSub('join', 'leave')
        expect(callback).toBeCalledWith(roomId, message)
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

          await listener(unsupportedEventMock)

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
      await listener(event)

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
      await listener(event)

      expect(callback).not.toBeCalled()
    })

    it('automatically joins Room for Matrix Admin`s INVITE RoomMember event type.', async () => {
      const roomId = 'some-room-id'
      const room = createRoomMock(roomId)

      const mxUserId = 'mx-user-id'
      mxClient.getUserId.mockReturnValue(mxUserId)
      mxClient.joinRoom.mockResolvedValue(room)
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
      await listener(event)

      // joins room
      expect(mxClient.joinRoom).toBeCalled()
      // does not call callback
      expect(callback).not.toBeCalled()
    })
  })

  describe('subscribeToRoomsUpdates() method', () => {
    it('name updates are propagated', async () => {
      const roomId = 'some-room-id'
      const room = createRoomMock(roomId)
      const event = createMatrixEventMock(RoomUpdatesType.name)
      const content = {} as IContent
      event.getEffectiveEvent.mockReturnValue({ content: content } as IEvent)
      const { listener, callback } = simulateSubscription('subscribeToRoomsUpdates', RoomEvent.Timeline)
      await listener(event, room)

      expect(callback).toBeCalledWith(roomId, RoomUpdatesType.name, content)
    })

    it('avatar updates are propagated', async () => {
      const roomId = 'some-room-id'
      const room = createRoomMock(roomId)
      const event = createMatrixEventMock(RoomUpdatesType.avatar)
      const content = {} as IContent
      event.getEffectiveEvent.mockReturnValue({ content: content } as IEvent)
      const { listener, callback } = simulateSubscription('subscribeToRoomsUpdates', RoomEvent.Timeline)
      await listener(event, room)

      expect(callback).toBeCalledWith(roomId, RoomUpdatesType.avatar, content)
    })

    it('when room is missing, the callback is not called', async () => {
      const event = createMatrixEventMock(RoomUpdatesType.avatar)
      const { listener, callback } = simulateSubscription('subscribeToRoomsUpdates', RoomEvent.Timeline)
      await listener(event)

      expect(callback).not.toBeCalled()
    })

    it('when different event type, the callback is not called', async () => {
      const event = createMatrixEventMock('other type')
      const { listener, callback } = simulateSubscription('subscribeToRoomsUpdates', RoomEvent.Timeline)
      await listener(event)

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

      await listener(notificationCount)

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

      await listener(notificationCount)

      expect(callback).not.toBeCalled()
    })
  })

  describe('subscribeToMembership() method', () => {
    it('handles new membership', async () => {
      const roomId = 'some-room-id'
      const userId = 'some-user'
      const userName = 'user name'
      const avatarUrl = 'avatarUrl'
      const currentMembership = MembershipStatus.Invited
      const member = createRoomMemberMock(userId, userName, currentMembership, avatarUrl)
      const event = createMatrixEventMock(EventType.RoomMember)
      const newMembership = MembershipStatus.Joined
      event.getContent.mockReturnValue({ membership: newMembership })
      const roomState = createRoomStateMock(roomId)
      roomState.getMembers.mockReturnValue([member])

      const { listener, callback } = simulateSubscription('subscribeToMembership', RoomStateEvent.Members)
      // event: MatrixEvent, roomState: RoomState, member: RoomMember
      await listener(event, roomState, member)

      expect(callback).toBeCalledWith(
        roomId,
        { avatar: avatarUrl, id: userId, membership: currentMembership, name: userName },
        newMembership
      )
    })
  })
})
