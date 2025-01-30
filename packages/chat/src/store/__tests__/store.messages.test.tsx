import { act, renderHook } from '@testing-library/react-hooks'
import { Provider, createStore, useAtom } from 'jotai'
import { EventType, type MatrixClient, type MatrixEvent, type Room, RoomEvent } from 'matrix-js-sdk'
import React from 'react'
import type { PropsWithChildren } from 'react'

import type ChatClient from '@holi/chat/src/client/ChatClient'
import type { ChatRoom, ChatRoomMember } from '@holi/chat/src/client/types'
import {
  _newMessageAtomSubscriber,
  _roomAtomsRecordAtomSubscriber,
  initChatClient,
  useRequestRoomMessages,
  useRoomById,
} from '@holi/chat/src/store/store'
import {
  createChatClient,
  createMatrixClientMock,
  createMatrixEventMock,
  fakeRoomMessageEvent,
  fakeUnrenderedEvent,
  getListenerForMatrixEvent,
} from '@holi/chat/src/test-utils'
import {
  fakeChatRoomMessageFrom,
  initChatRoomFixture,
  sendMessageEvent,
} from '@holi/chat/src/test-utils/matrix-fixtures'

jest.mock('matrix-js-sdk')
jest.mock('@holi/chat/src/client/pusher')

const useTestRoom = (roomId: string) => {
  const response = useRoomById(roomId)
  useAtom(_roomAtomsRecordAtomSubscriber)
  useAtom(_newMessageAtomSubscriber)
  return response
}

describe('Chat Store - messages', () => {
  const JotaiProvider = ({ children }: PropsWithChildren) => <Provider store={store}>{children}</Provider>
  let store: ReturnType<typeof createStore>
  let mxClient: jest.MockedObjectDeep<MatrixClient>
  let chatClient: ChatClient
  let room: ChatRoom
  let creator: ChatRoomMember

  beforeEach(() => {
    jest.clearAllTimers()
    mxClient = createMatrixClientMock()
    chatClient = createChatClient()
    initChatClient(chatClient)
    store = createStore()
    ;({ room, creator } = initChatRoomFixture(mxClient))
  })

  it('shoud receive messages in an existing room', () => {
    const { roomMock, room, creator, member } = initChatRoomFixture(mxClient)

    const { result } = renderHook(() => useTestRoom(room.id), { wrapper: JotaiProvider })
    const listener = getListenerForMatrixEvent(mxClient, RoomEvent.Timeline, 'messagesListener') as (
      event: MatrixEvent,
      room: Room | undefined
    ) => void

    expect(result.current).toStrictEqual([room, undefined])

    const { message: message1 } = sendMessageEvent(listener, roomMock, creator.id, 1)
    expect(result.current).toStrictEqual([
      { ...room, lastMessage: message1, timestamp: message1.timestamp },
      [message1],
    ])

    const { message: message2 } = sendMessageEvent(listener, roomMock, member.id, 2)
    expect(result.current).toStrictEqual([
      { ...room, lastMessage: message2, timestamp: message2.timestamp },
      [message1, message2],
    ])
  })

  it('A new message with the same event id should replace existing message content', () => {
    const { roomMock, room, creator, member } = initChatRoomFixture(mxClient)

    const { result } = renderHook(() => useTestRoom(room.id), { wrapper: JotaiProvider })
    const listener = getListenerForMatrixEvent(mxClient, RoomEvent.Timeline, 'messagesListener') as (
      event: MatrixEvent,
      room: Room | undefined
    ) => void

    expect(result.current).toStrictEqual([room, undefined])

    const { message: message1 } = sendMessageEvent(listener, roomMock, creator.id, 1)
    expect(result.current).toStrictEqual([
      { ...room, lastMessage: message1, timestamp: message1.timestamp },
      [message1],
    ])

    const { message: message2, event: event2 } = sendMessageEvent(listener, roomMock, creator.id, 2)
    expect(result.current).toStrictEqual([
      { ...room, lastMessage: message2, timestamp: message2.timestamp },
      [message1, message2],
    ])

    const { message: message3 } = sendMessageEvent(listener, roomMock, creator.id, 3)
    expect(result.current).toStrictEqual([
      { ...room, lastMessage: message3, timestamp: message3.timestamp },
      [message1, message2, message3],
    ])

    const event2Duplicate = fakeRoomMessageEvent(room.id, member.id, 4)
    event2Duplicate.event_id = event2.event_id
    event2Duplicate.origin_server_ts = event2.origin_server_ts
    const eventMock2Duplicate = createMatrixEventMock(EventType.RoomMessage, room.id, {}, event2Duplicate)
    act(() => listener(eventMock2Duplicate, roomMock))
    const message2Duplicate = fakeChatRoomMessageFrom(event2Duplicate)

    // the last message and timestamp is not updated, because an existing message with an older timestamp is replaced
    expect(result.current).toStrictEqual([
      { ...room, lastMessage: message3, timestamp: message3.timestamp },
      [message1, message2Duplicate, message3],
    ])
  })

  /* react ------------------> matrix sdk ------------> jotai store */
  /* useRequestRoomMessages    createMessagesRequest    useRoomById */

  it('Requesting messages for a room should update the store', async () => {
    const event1 = fakeRoomMessageEvent(room.id, creator.id, 1)
    const event2 = fakeRoomMessageEvent(room.id, creator.id, 2)
    const message1 = fakeChatRoomMessageFrom(event1)
    const message2 = fakeChatRoomMessageFrom(event2)
    const roomEvents = [event1, event2]
    mxClient.createMessagesRequest.mockResolvedValue({ chunk: roomEvents, start: 'start', end: undefined })

    const { result } = renderHook(() => useRequestRoomMessages(), { wrapper: JotaiProvider })
    await result.current(room.id, false)
    const { result: result2 } = renderHook(() => useTestRoom(room.id), { wrapper: JotaiProvider })

    expect(result2.current).toStrictEqual([room, [message2, message1]])
  })

  it('Requesting 2 messages from a room should repeatedly fetch messages until 2 messages are found', async () => {
    const me1 = fakeRoomMessageEvent(room.id, creator.id, 1)
    const ue2 = fakeUnrenderedEvent(room.id, creator.id, 2)
    const ue3 = fakeUnrenderedEvent(room.id, creator.id, 3)
    const me4 = fakeRoomMessageEvent(room.id, creator.id, 4)
    const me5 = fakeRoomMessageEvent(room.id, creator.id, 5)

    mxClient.createMessagesRequest
      .mockResolvedValueOnce({ chunk: [me1, ue2], start: 'start', end: 'someEnd' })
      .mockResolvedValueOnce({ chunk: [ue3, me4], start: 'start', end: 'someOtherEnd' })
      .mockResolvedValueOnce({ chunk: [me4, me5], start: 'start', end: undefined })

    const { result } = renderHook(() => useRequestRoomMessages(2), { wrapper: JotaiProvider })
    await result.current(room.id, false)
    const { result: result2 } = renderHook(() => useTestRoom(room.id), { wrapper: JotaiProvider })

    expect(result2.current).toStrictEqual([room, [fakeChatRoomMessageFrom(me4), fakeChatRoomMessageFrom(me1)]])
  })

  it('Requesting more messages than available, will fetch until end is reached', async () => {
    const me1 = fakeRoomMessageEvent(room.id, creator.id, 1)
    const ue2 = fakeUnrenderedEvent(room.id, creator.id, 2)
    const ue3 = fakeUnrenderedEvent(room.id, creator.id, 3)

    mxClient.createMessagesRequest
      .mockResolvedValueOnce({ chunk: [me1, ue2], start: 'start', end: 'someEnd' })
      .mockResolvedValueOnce({ chunk: [ue3], start: 'start', end: undefined })

    const { result } = renderHook(() => useRequestRoomMessages(2), { wrapper: JotaiProvider })
    await result.current(room.id, false)
    const { result: result2 } = renderHook(() => useTestRoom(room.id), { wrapper: JotaiProvider })

    expect(result2.current).toStrictEqual([room, [fakeChatRoomMessageFrom(me1)]])
  })
})
