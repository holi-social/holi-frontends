import { ClientEvent, Room } from 'matrix-js-sdk'

import {
  MockTransformer,
  createMatrixClientMock,
  createRoomMock,
  getClientOptions,
  getListenerForMatrixEvent,
} from '@holi/chat/src/__tests__/helpers'
import ChatClient from '@holi/chat/src/client/ChatClient'
import { createInitialRoom } from '@holi/chat/src/client/utils'

jest.mock('matrix-js-sdk')
jest.mock('@holi/chat/src/client/pusher', () => jest.fn())

describe('ChatClient', () => {
  let mxClient = createMatrixClientMock()
  beforeEach(() => {
    mxClient = createMatrixClientMock()
  })

  describe('subscribeToRooms() method', () => {
    it('calls the callback handler on new event', async () => {
      const roomId = 'testRoomId'
      const room = MockTransformer.toOriginalType(createRoomMock(roomId))

      const client = new ChatClient(getClientOptions('syt_p'))
      const roomSubscriberCallback = jest.fn()
      client.subscribeToRooms(roomSubscriberCallback)

      // extract roomListener that gets set in ChatClient
      const roomListener = getListenerForMatrixEvent(ClientEvent.Room, mxClient) as (room: Room) => void
      roomListener(room)

      expect(roomSubscriberCallback).toBeCalledWith(createInitialRoom(room), false)
    })
  })
})
