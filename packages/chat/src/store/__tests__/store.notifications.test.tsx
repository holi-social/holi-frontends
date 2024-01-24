import { act, renderHook } from '@testing-library/react-hooks'
import { Provider, createStore, useAtom } from 'jotai'
import { MatrixEvent, NotificationCount, Room, RoomEvent } from 'matrix-js-sdk'
import React from 'react'
import { PropsWithChildren } from 'react'

import {
  _newMessageAtomSubscriber,
  _roomAtomsRecordAtomSubscriber,
  _roomsNotificationsSubscriberAtom,
  initChatClient,
  useRoomById,
} from '@holi/chat/src/store/store'
import { createChatClient, createMatrixClientMock, getListenerForMatrixEvent } from '@holi/chat/src/test-utils'
import { initChatRoom, sendMessageEvent } from '@holi/chat/src/test-utils/matrix-fixtures'

jest.mock('matrix-js-sdk')
jest.mock('@holi/chat/src/client/pusher')

const useStoreMessagesAtomsTest = (roomId: string) => {
  const response = useRoomById(roomId)
  useAtom(_roomAtomsRecordAtomSubscriber)
  useAtom(_newMessageAtomSubscriber)
  useAtom(_roomsNotificationsSubscriberAtom)
  return response
}

describe('Chat Store - notifications', () => {
  const wrapper = ({ children }: PropsWithChildren) => <Provider store={store}>{children}</Provider>
  let store: ReturnType<typeof createStore>
  let mxClient = createMatrixClientMock()
  let chatClient = createChatClient()

  beforeEach(() => {
    jest.clearAllTimers()
    mxClient = createMatrixClientMock()
    chatClient = createChatClient()
    initChatClient(chatClient)
    store = createStore()
  })

  it('shoud update room notification count after a new message.', async () => {
    const { roomMock, room, member } = initChatRoom(mxClient)

    const { result, waitForNextUpdate } = renderHook(() => useStoreMessagesAtomsTest(room.id), { wrapper })
    const messageListener = getListenerForMatrixEvent(RoomEvent.Timeline, mxClient, 'messagesListener') as (
      event: MatrixEvent,
      room: Room | undefined
    ) => void
    const unreadNotificationsListener = getListenerForMatrixEvent(RoomEvent.UnreadNotifications, mxClient) as (
      notificationCount: NotificationCount
    ) => void

    await waitForNextUpdate()

    expect(result.current[0]?.notificationCount).toBe(0)

    // send the first message
    const { message: message1 } = sendMessageEvent(messageListener, roomMock, member.id, 1)
    act(() => unreadNotificationsListener({ highlight: 1, total: 1 }))
    expect(result.current).toStrictEqual([
      { ...room, notificationCount: 1, timestamp: message1.timestamp, lastMessage: message1 },
      [message1],
    ])

    // send the second message
    const { message: message2 } = sendMessageEvent(messageListener, roomMock, member.id, 2)
    act(() => unreadNotificationsListener({ highlight: 2, total: 2 }))
    expect(result.current).toStrictEqual([
      { ...room, notificationCount: 2, timestamp: message2.timestamp, lastMessage: message2 },
      [message1, message2],
    ])
  })
})
