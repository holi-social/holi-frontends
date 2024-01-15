import { renderHook } from '@testing-library/react-hooks'
import { createStore, useAtom, useAtomValue } from 'jotai'
import { ClientEvent, Room } from 'matrix-js-sdk'
import { act } from 'react-test-renderer'

import {
  createMatrixClientMock,
  createRoomMemberMock,
  createRoomMock,
  getClientOptions,
  getListenerForMatrixEvent,
} from '@holi/chat/src/__tests__/helpers'
import ChatClient from '@holi/chat/src/client/ChatClient'
import { _roomAtomsRecordAtomSubscriber, initChatClient, roomAtomsRecordAtom } from '@holi/chat/src/store/store'

jest.mock('matrix-js-sdk')
jest.mock('@holi/chat/src/client/pusher')

const useRoomAtomsTest = () => {
  const roomAtomsRecord = useAtomValue(roomAtomsRecordAtom)
  useAtom(_roomAtomsRecordAtomSubscriber)
  return roomAtomsRecord
}

describe('Chat Store - rooms', () => {
  let mxClient = createMatrixClientMock()
  let store: ReturnType<typeof createStore>

  beforeEach(() => {
    mxClient = createMatrixClientMock()
    store = createStore()

    mxClient.getIgnoredUsers.mockReturnValue([])
    mxClient.getRooms.mockReturnValue([])
  })

  it('should subscribeToNewRooms and update the _roomAtomsRecordAtom with an incoming room', () => {
    const roomId = 'celestia'
    const roomMock = createRoomMock(roomId, {
      members: ['david.m.rosen', 'fusajiro.yamauchi'].map((userId) => createRoomMemberMock(userId)),
      timelineEvents: [],
    })

    const chatClient = new ChatClient(getClientOptions('syt_p'))
    initChatClient(chatClient)

    const { result } = renderHook(() => useRoomAtomsTest())
    expect(result.current[roomId]).toBeUndefined()

    const listener = getListenerForMatrixEvent(ClientEvent.Room, mxClient, 'roomEventHandler') as (room: Room) => void

    act(() => listener(roomMock))

    expect(result.current).toHaveProperty(roomId)
    expect(store.get(result.current[roomId])).toStrictEqual({
      avatar: undefined,
      creator: null,
      hasInvitation: false,
      id: 'celestia',
      lastMessage: undefined,
      members: [
        {
          avatar: undefined,
          id: 'david.m.rosen',
          membership: undefined,
          name: undefined,
        },
        {
          avatar: undefined,
          id: 'fusajiro.yamauchi',
          membership: undefined,
          name: undefined,
        },
      ],
      name: undefined,
      notificationCount: NaN,
      timestamp: undefined,
      type: 'private',
    })
  })
})
