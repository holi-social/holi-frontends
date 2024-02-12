import {
  ClientEvent,
  EmittedEvents,
  EventEmitterEvents,
  EventType,
  IContent,
  IEvent,
  MatrixClient,
  Room,
  RoomEvent,
  RoomMember,
  RoomStateEvent,
} from 'matrix-js-sdk'

import ChatClient from '@holi/chat/src/client/ChatClient'
import { ChatRoomEvent, MembershipStatus, RoomUpdatesType } from '@holi/chat/src/client/types'
import { createChatMessage, createChatRoom } from '@holi/chat/src/client/utils'
import {
  createChatClient,
  createMatrixClientMock,
  createMatrixEventMock,
  createRoomMemberMock,
  createRoomMock,
  createRoomStateMock,
  getListenerForMatrixEvent,
} from '@holi/chat/src/test-utils'

jest.mock('matrix-js-sdk')
jest.mock('@holi/chat/src/client/pusher', () => jest.fn())
const chatAdminUserId = 'matrix-admin-user-id'
jest.mock('@holi/core/helpers/config', () => ({
  chatAdminUserId,
}))

describe('ChatClient', () => {
  let mxClient: jest.MockedObjectDeep<MatrixClient>
  let client: ChatClient

  beforeEach(() => {
    mxClient = createMatrixClientMock()
    client = createChatClient()
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
    const listener = getListenerForMatrixEvent(registerOn ? registerOn : mxClient, eventType) as (
      ...args: unknown[]
    ) => Promise<void>
    return { listener, callback }
  }

  describe('subscribeToNewRooms() method', () => {
    it('should call the passed callback on new event', async () => {
      const roomId = 'testRoomId'
      const timestamp = 1706715917444
      const room = createRoomMock(roomId, { timestamp, timelineEvents: [] })

      const { listener, callback } = simulateSubscription(client.subscribeToNewRooms, ClientEvent.Room)
      await listener(room)

      expect(callback).toBeCalledWith(
        createChatRoom(client['createSharedData'](room), mxClient.getHomeserverUrl(), false)
      )
    })

    it('should auto join a Space room on new rooms', async () => {
      const room = {} as Room
      mxClient.getUserId.mockReturnValue('dummy_user_id')
      mxClient.joinRoom.mockResolvedValue(room)

      const roomId = 'SpaceRoomId'
      const timestamp = 1706715917444
      const roomMock = createRoomMock(roomId, { timestamp, timelineEvents: [], isSpaceRoom: true })
      roomMock.hasMembershipState.mockReturnValue(true)

      const { listener, callback } = simulateSubscription(client.subscribeToNewRooms, ClientEvent.Room)
      await listener(roomMock)

      expect(mxClient.joinRoom).toBeCalledWith(roomId)
      expect(callback).toBeCalledTimes(0)
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
    it('should ignore non-SharedData events', async () => {
      const room = createRoomMock('spaceRoom')

      const { listener, callback } = simulateSubscription(client.subscribeToSharedData, RoomEvent.Timeline, room)

      // configure event
      const nonSharedDataEvent = createMatrixEventMock(RoomEvent.MyMembership)

      // trigger event
      await listener(nonSharedDataEvent)

      expect(callback).not.toBeCalled()
    })

    it('should create a SpaceChatRoom on SharedData and its children on SpaceParent events', async () => {
      const timestamp = 1706715917444
      const holiSpaceId = 'holi-space-id'
      const spaceRoomId = 'spaceRoom'
      const spaceChildRoomId = 'childRoom'

      // configure events
      const spaceRoomContent = { holiSpaceId, roomId: spaceRoomId }
      const spaceChildContent = {
        holiSpaceId,
        roomId: spaceChildRoomId,
        spaceName: spaceRoomId,
        avatarDefaultColor: '#7BD7EA',
        parentSpaceRoomId: spaceRoomId,
      }

      const spaceSharedDataEvent = createMatrixEventMock(ChatRoomEvent.SharedData, spaceRoomId, undefined, {
        content: spaceRoomContent,
      } as unknown as IEvent)

      const spaceChildSharedDataEvent = createMatrixEventMock(ChatRoomEvent.SharedData, spaceChildRoomId, undefined, {
        content: spaceChildContent,
      } as unknown as IEvent)

      const spaceParentEvent = createMatrixEventMock(EventType.SpaceParent, spaceChildRoomId, undefined, {
        content: { canonical: true },
        state_key: spaceRoomId,
        room_id: spaceChildRoomId,
      } as unknown as IEvent)

      const spaceRoomMock = createRoomMock(spaceRoomId, {
        timestamp,
        timelineEvents: [],
        isSpaceRoom: true,
        stateEvents: [spaceSharedDataEvent],
      })

      const spaceChildRoomMock = createRoomMock(spaceRoomId, {
        timestamp,
        timelineEvents: [],
        stateEvents: [spaceParentEvent, spaceChildSharedDataEvent],
      })

      const { listener, callback } = simulateSubscription(
        client.subscribeToSharedData,
        RoomEvent.Timeline,
        spaceRoomMock
      )

      // trigger event
      await listener(spaceSharedDataEvent, spaceRoomMock)
      await listener(spaceChildSharedDataEvent, spaceChildRoomMock)

      expect(callback).toBeCalledTimes(1)

      await listener(spaceParentEvent, spaceChildRoomMock)

      expect(callback).toBeCalledTimes(2)
      expect(callback).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          type: 'space',
          content: spaceRoomContent,
        })
      )
      expect(callback).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          type: 'space.child',
          content: spaceChildContent,
        })
      )
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
      const messageEventMock = createMatrixEventMock(EventType.RoomMessage, roomId, {}, effectiveEvent)

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
        const event = createMatrixEventMock(
          EventType.RoomMember,
          roomId,
          { membership: eventMembership },
          effectiveEvent
        )

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

          const unsupportedEventMock = createMatrixEventMock(eventType, roomId)

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
      const event = createMatrixEventMock(EventType.RoomMember, roomId, { membership: 'invite' }, {
        state_key: mxUserId,
      } as IEvent)
      event.getSender.mockReturnValue(chatAdminUserId)

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
      const event = createMatrixEventMock(EventType.RoomMember, roomId, { membership: newMembership })
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
