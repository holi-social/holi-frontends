import { ClientEvent, MatrixEvent, Room, RoomEvent } from 'matrix-js-sdk'

import {
  MockTransformer,
  createMatrixClientMock,
  createMatrixEventMock,
  createRoomMock,
  getClientOptions,
  getListenerForMatrixEvent,
} from '@holi/chat/src/__tests__/helpers'
import ChatClient from '@holi/chat/src/client/ChatClient'
import { ChatRoomEvent, SpaceRoom } from '@holi/chat/src/client/types'
import { createInitialRoom } from '@holi/chat/src/client/utils'

jest.mock('matrix-js-sdk')
jest.mock('@holi/chat/src/client/pusher', () => jest.fn())

describe('ChatClient', () => {
  let mxClient = createMatrixClientMock()
  beforeEach(() => {
    mxClient = createMatrixClientMock()
  })

  describe('subscribeToRooms() method', () => {
    const simulateNewRoomEvent = (room: Room) => {
      const client = new ChatClient(getClientOptions('syt_p'))
      const roomSubscriberCallback = jest.fn()
      client.subscribeToRooms(roomSubscriberCallback)

      // extract roomListener that gets set in ChatClient
      const roomListener = getListenerForMatrixEvent(ClientEvent.Room, mxClient) as (room: Room) => void
      roomListener?.(room)

      return roomSubscriberCallback
    }

    it('calls the callback handler on new event', async () => {
      const roomId = 'testRoomId'
      const room = MockTransformer.toOriginalType(createRoomMock(roomId))

      const roomSubscriberCallback = simulateNewRoomEvent(room)

      expect(roomSubscriberCallback).toBeCalledWith(createInitialRoom(room), false)
    })

    it('on a new Space room event joins that room and then calls the callback handler', async () => {
      let room = {} as Room
      mxClient.getUserId.mockReturnValue('dummy_user_id')
      mxClient.joinRoom.mockResolvedValue(room)

      const roomId = 'SpaceRoomId'
      const roomMock = createRoomMock(roomId, { isSpaceRoom: true })
      roomMock.hasMembershipState.mockReturnValue(true)
      room = MockTransformer.toOriginalType(roomMock)

      const roomSubscriberCallback = simulateNewRoomEvent(room)

      expect(mxClient.joinRoom).toBeCalledWith(roomId)
      expect(roomSubscriberCallback).toBeCalledWith(createInitialRoom(room), true)
    })
  })

  describe('subscribeToRoomDeletion() method', () => {
    it('calls the passed callback.', async () => {
      const roomId = 'roomDeletedId'
      const client = new ChatClient(getClientOptions('syt_p'))
      const roomDeletionCallback = jest.fn()
      client.subscribeToRoomDeletion(roomDeletionCallback)

      // extract roomListener that gets set in ChatClient
      const roomListener = getListenerForMatrixEvent(ClientEvent.DeleteRoom, mxClient) as (room_id: string) => void
      roomListener?.(roomId)

      expect(roomDeletionCallback).toBeCalledWith(roomId)
    })
  })

  describe('subscribeToRoomSharedData() method', () => {
    describe('subscribes to RoomSharedData events of existing rooms', () => {
      const spaceRoom = MockTransformer.toOriginalType(createRoomMock('spaceRoom'))
      mxClient.getRooms.mockReturnValue([spaceRoom])

      const client = new ChatClient(getClientOptions('syt_p'))
      const roomSharedDataCallback = jest.fn()
      client.subscribeToRoomSharedData(roomSharedDataCallback)

      // get room listener of SharedData event
      const roomListener = getListenerForMatrixEvent(RoomEvent.Timeline, mxClient) as (
        event: MatrixEvent
      ) => Promise<void>

      it('ignores non-SharedData events', async () => {
        // configure event
        const nonSharedDataEvent = createMatrixEventMock(RoomEvent.MyMembership)
        // trigger event
        await roomListener(MockTransformer.toOriginalType(nonSharedDataEvent))
        expect(roomSharedDataCallback).not.toBeCalled()
      })

      it('react on SharedData event', async () => {
        // configure event
        const spaceRoomSharedDataEventMock = createMatrixEventMock(ChatRoomEvent.SharedData)
        const content = { roomId: 'room', holiSpaceId: 'holi-space-id' }
        spaceRoomSharedDataEventMock.event = { content }

        // trigger event
        await roomListener(MockTransformer.toOriginalType(spaceRoomSharedDataEventMock))

        expect(roomSharedDataCallback).toBeCalled()
        const roomSharedDataCallbackArgument: SpaceRoom = roomSharedDataCallback.mock.calls[0][0]
        expect(roomSharedDataCallbackArgument.type).toBe('space')
        expect(roomSharedDataCallbackArgument.content).toBe(content)
        expect(roomSharedDataCallbackArgument.room).toBe(spaceRoom)
      })
    })
  })
})
