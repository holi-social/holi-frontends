import { act, renderHook } from '@testing-library/react-hooks'
import { Provider, createStore, useAtom } from 'jotai'
import { EventType, IContent, IEvent, IRoomEvent, MatrixEvent, Room, RoomEvent } from 'matrix-js-sdk'
import React from 'react'
import { PropsWithChildren } from 'react'

import { ChatRoomMember, ChatRoomMessage, MembershipStatus } from '@holi/chat/src/client/types'
import {
  _newMessageAtomSubscriber,
  _roomAtomsRecordAtomSubscriber,
  initChatClient,
  useRequestRoomMessages,
  useRoomById,
} from '@holi/chat/src/store/store'
import { ChatRoom } from '@holi/chat/src/store/types'
import {
  createChatClient,
  createMatrixClientMock,
  createMatrixEventMock,
  createRoomMemberMock,
  createRoomMock,
  getListenerForMatrixEvent,
} from '@holi/chat/src/test-utils'

jest.mock('matrix-js-sdk')
jest.mock('@holi/chat/src/client/pusher')

const useStoreMessagesAtomsTest = (roomId: string) => {
  const response = useRoomById(roomId)
  useAtom(_roomAtomsRecordAtomSubscriber)
  useAtom(_newMessageAtomSubscriber)
  return response
}

describe('Chat Store - messages', () => {
  const wrapper = ({ children }: PropsWithChildren) => <Provider store={store}>{children}</Provider>
  let store: ReturnType<typeof createStore>
  let mxClient = createMatrixClientMock()
  let chatClient = createChatClient()

  const roomId = 'roomId'

  const creator: ChatRoomMember = {
    avatar: 'https://unsplash.com/photos/a-black-and-white-photo-of-a-diamond-vbPk2tB2HrU',
    id: '@room.creator:holi.social',
    membership: MembershipStatus.join,
    name: 'room creator',
  }
  const member: ChatRoomMember = {
    avatar: 'https://unsplash.com/photos/a-group-of-blue-and-orange-shapes-on-a-white-surface-g0lR2cThaR0',
    id: '@a.member:holi.social',
    membership: MembershipStatus.join,
    name: 'a member',
  }
  const members: ChatRoomMember[] = [creator, member]

  beforeEach(() => {
    jest.clearAllTimers()
    mxClient = createMatrixClientMock()
    chatClient = createChatClient()
    initChatClient(chatClient)
    store = createStore()
  })

  const init = () => {
    const creatorMock = createRoomMemberMock(creator.id, creator.name, creator.membership, creator.avatar)
    const roomMock = createRoomMock(roomId, {
      name: 'roomName',
      members: members.map(({ avatar, id, membership, name }) => createRoomMemberMock(id, name, membership, avatar)),
      timelineEvents: [],
    })

    roomMock.getCreator.mockReturnValue(creator.id)
    roomMock.getMember.mockReturnValue(creatorMock)
    roomMock.getMyMembership.mockReturnValue('join')
    roomMock.getUnreadNotificationCount.mockReturnValue(0)

    mxClient.getRooms.mockReturnValue([roomMock])
    mxClient.roomState.mockReturnValue(Promise.resolve([]))

    const room: ChatRoom = {
      avatar: undefined,
      creator: creator,
      hasInvitation: false,
      id: roomId,
      lastMessage: undefined,
      members,
      name: 'roomName',
      notificationCount: 0,
      timestamp: undefined,
      type: 'private',
    }

    return { roomMock, room }
  }

  const msgEvent = (roomId: string, senderId: string, eventNr: number): IEvent => {
    return {
      state_key: 'dummy',
      event_id: 'id_' + eventNr,
      type: EventType.RoomMessage,
      sender: senderId,
      origin_server_ts: eventNr,
      unsigned: {},
      room_id: roomId,
      content: {
        body: 'message body ' + eventNr,
      } as IContent,
    }
  }

  const expectedMsgForEvent = (e: IEvent): ChatRoomMessage => {
    return {
      id: e.event_id,
      timestamp: e.origin_server_ts,
      roomId: e.room_id || '',
      type: 'message',
      sender: e.sender,
      content: {
        body: e.content.body,
        msgtype: 'm.text',
      },
    }
  }

  const sendMessageEvent = (
    listener: (event: MatrixEvent, room: Room | undefined) => void,
    roomMock: Room,
    senderId: string,
    eventNr: number
  ) => {
    const event = msgEvent(roomMock.roomId, senderId, eventNr)
    const eventMock = createMatrixEventMock(EventType.RoomMessage, roomMock.roomId, {}, event)

    act(() => listener(eventMock, roomMock))

    const message = expectedMsgForEvent(event)
    return { message, event, eventMock }
  }

  it('shoud receive messages in an existing room', async () => {
    const { roomMock, room } = init()

    const { result, waitForNextUpdate } = renderHook(() => useStoreMessagesAtomsTest(roomId), { wrapper })
    const listener = getListenerForMatrixEvent(RoomEvent.Timeline, mxClient, 'messagesListener') as (
      event: MatrixEvent,
      room: Room | undefined
    ) => void

    await waitForNextUpdate()

    expect(result.current).toStrictEqual([room, undefined])

    const { message: message1 } = sendMessageEvent(listener, roomMock, creator.id, 1)
    room.lastMessage = message1
    room.timestamp = message1.timestamp
    expect(result.current).toStrictEqual([room, [message1]])

    const { message: message2 } = sendMessageEvent(listener, roomMock, member.id, 2)
    room.lastMessage = message2
    room.timestamp = message2.timestamp
    expect(result.current).toStrictEqual([room, [message1, message2]])
  })

  it('A new message with the same event id should replace existing message content', async () => {
    const { roomMock, room } = init()

    const { result, waitForNextUpdate } = renderHook(() => useStoreMessagesAtomsTest(roomId), { wrapper })
    const listener = getListenerForMatrixEvent(RoomEvent.Timeline, mxClient, 'messagesListener') as (
      event: MatrixEvent,
      room: Room | undefined
    ) => void

    await waitForNextUpdate()

    expect(result.current).toStrictEqual([room, undefined])

    const { message: message1 } = sendMessageEvent(listener, roomMock, creator.id, 1)
    room.lastMessage = message1
    room.timestamp = 1
    expect(result.current).toStrictEqual([room, [message1]])

    const { message: message2, event: event2 } = sendMessageEvent(listener, roomMock, creator.id, 2)
    room.lastMessage = message2
    room.timestamp = message2.timestamp
    expect(result.current).toStrictEqual([room, [message1, message2]])

    const { message: message3 } = sendMessageEvent(listener, roomMock, creator.id, 3)
    room.lastMessage = message3
    room.timestamp = message3.timestamp
    expect(result.current).toStrictEqual([room, [message1, message2, message3]])

    const event2Duplicate = msgEvent(roomId, member.id, 4)
    event2Duplicate.event_id = event2.event_id
    event2Duplicate.origin_server_ts = event2.origin_server_ts
    const eventMock2Duplicate = createMatrixEventMock(EventType.RoomMessage, roomId, {}, event2Duplicate)
    act(() => listener(eventMock2Duplicate, roomMock))
    const message2Duplicate = expectedMsgForEvent(event2Duplicate)

    // the last message and timestamp is not updated, because an existing message with an older timestamp is replaced
    expect(result.current).toStrictEqual([room, [message1, message2Duplicate, message3]])
  })

  it('Requesting room messages should update the store in bulk, but not the room', async () => {
    const { room } = init()

    const event1 = msgEvent(roomId, creator.id, 1)
    const event2 = msgEvent(roomId, creator.id, 2)
    const event3 = msgEvent(roomId, creator.id, 3)
    const roomEvents = [event1, event2, event3] as IRoomEvent[]
    mxClient.createMessagesRequest.mockReturnValue(Promise.resolve({ chunk: roomEvents, start: 'start', end: 'end' }))
    const { result } = renderHook(() => useRequestRoomMessages(), { wrapper })
    result.current(roomId, false)

    const { result: result2, waitForNextUpdate } = renderHook(() => useStoreMessagesAtomsTest(roomId), { wrapper })

    await waitForNextUpdate()

    const message1 = expectedMsgForEvent(event1)
    const message2 = expectedMsgForEvent(event2)
    const message3 = expectedMsgForEvent(event3)
    expect(result2.current).toStrictEqual([room, [message3, message2, message1]])
  })
})
