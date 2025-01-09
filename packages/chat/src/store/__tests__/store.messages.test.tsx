import { act, renderHook } from '@testing-library/react-hooks'
import { waitFor } from '@testing-library/react-native'
import { Provider, createStore, useAtom } from 'jotai'
import { EventType, type IRoomEvent, type MatrixClient, type MatrixEvent, type Room, RoomEvent } from 'matrix-js-sdk'
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
  getListenerForMatrixEvent,
} from '@holi/chat/src/test-utils'
import {
  expectedMsgForEvent,
  initChatRoomFixture,
  msgEvent,
  sendMessageEvent,
} from '@holi/chat/src/test-utils/matrix-fixtures'

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

    const { result } = renderHook(() => useStoreMessagesAtomsTest(room.id), { wrapper })
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

    const { result } = renderHook(() => useStoreMessagesAtomsTest(room.id), { wrapper })
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

    const event2Duplicate = msgEvent(room.id, member.id, 4)
    event2Duplicate.event_id = event2.event_id
    event2Duplicate.origin_server_ts = event2.origin_server_ts
    const eventMock2Duplicate = createMatrixEventMock(EventType.RoomMessage, room.id, {}, event2Duplicate)
    act(() => listener(eventMock2Duplicate, roomMock))
    const message2Duplicate = expectedMsgForEvent(event2Duplicate)

    // the last message and timestamp is not updated, because an existing message with an older timestamp is replaced
    expect(result.current).toStrictEqual([
      { ...room, lastMessage: message3, timestamp: message3.timestamp },
      [message1, message2Duplicate, message3],
    ])
  })

  it('Requesting room messages should update the store in bulk, but not the room', async () => {
    const event1 = msgEvent(room.id, creator.id, 1)
    const event2 = msgEvent(room.id, creator.id, 2)
    const event3 = msgEvent(room.id, creator.id, 3)
    const roomEvents = [event1, event2, event3] as IRoomEvent[]
    mxClient.createMessagesRequest.mockResolvedValue({ chunk: roomEvents, start: 'start', end: 'end' })
    const { result } = renderHook(() => useRequestRoomMessages(), { wrapper })
    result.current(room.id, false)

    const { result: result2 } = renderHook(() => useStoreMessagesAtomsTest(room.id), { wrapper })

    const message1 = expectedMsgForEvent(event1)
    const message2 = expectedMsgForEvent(event2)
    const message3 = expectedMsgForEvent(event3)

    await waitFor(() => {
      expect(result2.current).toStrictEqual([room, [message3, message2, message1]])
    })
  })
})
