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
import { ChatRoomEvent, MembershipStatus, RoomUpdatesType } from '@holi/chat/src/client/types'
import { createChatMessage, createInitialRoom } from '@holi/chat/src/client/utils'

jest.mock('matrix-js-sdk')
jest.mock('@holi/chat/src/client/pusher', () => jest.fn())
const chatAdminUserId = 'matrix-admin-user-id'
jest.mock('@holi/core/helpers/config', () => ({
  chatAdminUserId,
}))

describe('ChatClient', () => {
  let mxClient = createMatrixClientMock()
  let client: ChatClient = {} as ChatClient
  beforeEach(() => {
    mxClient = createMatrixClientMock()
    client = new ChatClient(getClientOptions('syt_p'))
  })

  const simulateSubscription = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fn: (x: any) => void,
    eventType: EmittedEvents | EventEmitterEvents | RoomEvent,
    room?: jest.Mocked<Room>,
    registerOn?: jest.Mocked<Room>
  ) => {
    if (room) mxClient.getRooms.mockReturnValue([room])
    const callback = jest.fn()
    fn.call(client, callback)
    const listener = getListenerForMatrixEvent(eventType, registerOn ? registerOn : mxClient) as (
      ...args: unknown[]
    ) => Promise<void>
    return { listener, callback }
  }

  describe('subscribeToNewRooms() method', () => {
    it('calls the callback handler on new event', async () => {
      const roomId = 'testRoomId'
      const room = createRoomMock(roomId)

      const { listener, callback } = simulateSubscription(client.subscribeToNewRooms, ClientEvent.Room)
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

      const { listener, callback } = simulateSubscription(client.subscribeToNewRooms, ClientEvent.Room)
      await listener(roomMock)

      expect(mxClient.joinRoom).toBeCalledWith(roomId)
      expect(callback).toBeCalledWith(createInitialRoom(roomMock), true)
    })
  })

  describe('subscribeToRoomDeletion() method', () => {
    it('calls the passed callback.', async () => {
      const roomId = 'roomDeletedId'

      const { listener, callback } = simulateSubscription(client.subscribeToRoomDeletion, ClientEvent.DeleteRoom)
      await listener(roomId)

      expect(callback).toBeCalledWith(roomId)
    })
  })

  describe('subscribeToRoomSharedData() method', () => {
    describe('subscribes to RoomSharedData events of existing rooms', () => {
      it('ignores non-SharedData events', async () => {
        const room = createRoomMock('spaceRoom')

        const { listener, callback } = simulateSubscription(client.subscribeToRoomSharedData, RoomEvent.Timeline, room)

        // configure event
        const nonSharedDataEvent = createMatrixEventMock(RoomEvent.MyMembership)

        // trigger event
        await listener(nonSharedDataEvent)

        expect(callback).not.toBeCalled()
      })

      it('react on SharedData event', async () => {
        const room = createRoomMock('spaceRoom')
        const { listener, callback } = simulateSubscription(client.subscribeToRoomSharedData, RoomEvent.Timeline, room)

        // configure event
        const spaceRoomSharedDataEventMock = createMatrixEventMock(ChatRoomEvent.SharedData)
        const content = { roomId: 'room', holiSpaceId: 'holi-space-id' }
        ;(spaceRoomSharedDataEventMock.event as Partial<IEvent>) = { content }

        // trigger event
        await listener(spaceRoomSharedDataEventMock, room)

        expect(callback).toBeCalledTimes(1)
        expect(callback).toBeCalledWith({ type: 'space', content, room })
      })
    })
  })

  describe('subscribeToRoomMessages() method', () => {
    it('handles Message events.', async () => {
      const roomId = 'some-room-id'
      const room = createRoomMock(roomId)

      const { listener, callback } = simulateSubscription(client.subscribeToRoomMessages, RoomEvent.Timeline, room)

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
      const messageEventMock = createMatrixEventMock(EventType.RoomMessage)
      messageEventMock.getRoomId.mockReturnValue(roomId)
      messageEventMock.getEffectiveEvent.mockReturnValue(effectiveEvent)

      await listener(messageEventMock, room)

      expect(callback).toBeCalledWith(roomId, createChatMessage(roomId, effectiveEvent))
    })

    describe('handles membership', () => {
      const simulatesMembershipSub = async (roomMembership: string, eventMembership: string) => {
        const roomId = 'some-room-id'
        const room = createRoomMock(roomId)
        room.getMember.mockReturnValue({ membership: roomMembership } as RoomMember)

        const { listener, callback } = simulateSubscription(client.subscribeToRoomMessages, RoomEvent.Timeline, room)

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
        const event = createMatrixEventMock(EventType.RoomMember, { membership: eventMembership })
        event.getRoomId.mockReturnValue(roomId)
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

          const { listener, callback } = simulateSubscription(
            client.subscribeToRoomMessages,
            RoomEvent.Timeline,
            room,
            room
          )

          const unsupportedEventMock = createMatrixEventMock(eventType)
          unsupportedEventMock.getRoomId.mockReturnValue(roomId)

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
      const event = createMatrixEventMock(EventType.SpaceChild)
      event.getEffectiveEvent.mockReturnValue({} as IEvent)

      const { listener, callback } = simulateSubscription(client.subscribeToSpaceRooms, RoomEvent.Timeline, room)
      await listener(event)

      expect(callback).toBeCalled()
    })

    it('ignores non-SpaceChild event types', async () => {
      const roomId = 'some-room-id'
      const room = createRoomMock(roomId)

      // Timeline event of type SpaceParent
      const event = createMatrixEventMock(EventType.SpaceParent)
      event.getEffectiveEvent.mockReturnValue({} as IEvent)

      const { listener, callback } = simulateSubscription(client.subscribeToSpaceRooms, RoomEvent.Timeline, room)
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
      const event = createMatrixEventMock(EventType.RoomMember, { membership: 'invite' })
      event.getEffectiveEvent.mockReturnValue({ state_key: mxUserId } as IEvent)
      event.getSender.mockReturnValue(chatAdminUserId)
      event.getRoomId.mockReturnValue(roomId)

      const { listener, callback } = simulateSubscription(client.subscribeToSpaceRooms, RoomEvent.Timeline, room)
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
      const { listener, callback } = simulateSubscription(client.subscribeToRoomsUpdates, RoomEvent.Timeline)
      await listener(event, room)

      expect(callback).toBeCalledWith(roomId, RoomUpdatesType.name, content)
    })

    it('avatar updates are propagated', async () => {
      const roomId = 'some-room-id'
      const room = createRoomMock(roomId)
      const event = createMatrixEventMock(RoomUpdatesType.avatar)
      const content = {} as IContent
      event.getEffectiveEvent.mockReturnValue({ content: content } as IEvent)
      const { listener, callback } = simulateSubscription(client.subscribeToRoomsUpdates, RoomEvent.Timeline)
      await listener(event, room)

      expect(callback).toBeCalledWith(roomId, RoomUpdatesType.avatar, content)
    })

    it('when room is missing, the callback is not called', async () => {
      const event = createMatrixEventMock(RoomUpdatesType.avatar)
      const { listener, callback } = simulateSubscription(client.subscribeToRoomsUpdates, RoomEvent.Timeline)
      await listener(event)

      expect(callback).not.toBeCalled()
    })

    it('when different event type, the callback is not called', async () => {
      const event = createMatrixEventMock('other type')
      const { listener, callback } = simulateSubscription(client.subscribeToRoomsUpdates, RoomEvent.Timeline)
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
        client.subscribeToUnreadRoomsNotifications,
        RoomEvent.UnreadNotifications,
        room,
        room
      )

      await listener(notificationCount)

      expect(callback).toBeCalledWith(roomId, notificationCount)
    })

    it('ignores UnreadNotifications event with `0` count value.', async () => {
      const room = createRoomMock('some-room-id')
      const notificationCount = 0

      const { listener, callback } = simulateSubscription(
        client.subscribeToUnreadRoomsNotifications,
        RoomEvent.UnreadNotifications,
        room,
        room
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
      const currentMembership = MembershipStatus.invite
      const member = createRoomMemberMock(userId, userName, currentMembership, avatarUrl)
      const newMembership = MembershipStatus.join
      const event = createMatrixEventMock(EventType.RoomMember, { membership: newMembership })
      const roomState = createRoomStateMock(roomId)
      roomState.getMembers.mockReturnValue([member])

      const { listener, callback } = simulateSubscription(client.subscribeToMembership, RoomStateEvent.Members)
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
