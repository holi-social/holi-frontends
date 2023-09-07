import type { Mock } from 'jest'
import { ClientEvent, MatrixClient, Room, RoomEvent } from 'matrix-js-sdk'

import { addRoomEventListener, setRoomsListeners } from '@holi/chat/src/client/utils'
import * as ClientListenersModule from '@holi/chat/src/client/utils'

const createRoomMock = (): Mock<Room> =>
  jest.fn().mockImplementation((roomId: string) => {
    return { on: jest.fn(), off: jest.fn(), roomId }
  })

const createMxClientMock = (): Mock<MatrixClient> =>
  jest.fn().mockImplementation((withEvents: boolean) => {
    return {
      on: jest.fn().mockImplementation((_: ClientEvent, listener: (room: Room) => void) => {
        if (!withEvents) return
        const Room = createRoomMock()
        listener(new Room('room-5-incoming'))
        listener(new Room('room-6-incoming'))
      }),
      off: jest.fn(),
    }
  })

it('should have set the listener in a room and return it - addRoomEventListener', () => {
  const Room = createRoomMock()

  const room = new Room('room-1')
  const handler = jest.fn((room) => () => room)

  const incomingMessagesListener = addRoomEventListener(RoomEvent.Timeline, handler)
  const listener = incomingMessagesListener(room)

  expect(handler).toHaveBeenCalledTimes(1)
  expect(handler).toHaveBeenCalledWith(room)
  expect(room.on).toHaveBeenCalledTimes(1)
  expect(room.on).toHaveBeenCalledWith(RoomEvent.Timeline, expect.any(Function))
  expect(typeof listener === 'function').toBeTruthy()
})

it('should create listeners for all existing rooms - createRoomsListeners', () => {
  const Room = createRoomMock()
  const MatrixClient = createMxClientMock()

  const client: Mock<MatrixClient> = new MatrixClient()
  const rooms: Mock<Room>[] = ['room-1', 'room-2', 'room-3', 'room-4'].map((id) => new Room(id))

  const createListener = jest.fn()

  const createRoomListenersSpy = jest.spyOn(ClientListenersModule, 'setRoomsListeners')

  const unsubscribe = setRoomsListeners({
    client,
    rooms,
    createListener,
    roomEvent: RoomEvent.Timeline,
  })

  expect(createRoomListenersSpy).toHaveBeenCalledTimes(1)
  expect(createListener).toHaveBeenCalledTimes(rooms.length)
  expect(unsubscribe).toStrictEqual(expect.any(Function))
})

it('should create listeners for all existing and incoming rooms - createRoomsListeners', () => {
  const Room = createRoomMock()
  const MatrixClient = createMxClientMock()

  const client: Mock<MatrixClient> = new MatrixClient(true)
  const rooms: Mock<Room>[] = ['room-1', 'room-2', 'room-3', 'room-4'].map((id) => new Room(id))

  const createListener = jest.fn()

  const createRoomListenersSpy = jest.spyOn(ClientListenersModule, 'setRoomsListeners')

  const unsubscribe = setRoomsListeners({
    client,
    rooms,
    createListener,
    roomEvent: RoomEvent.Timeline,
  })

  expect(createRoomListenersSpy).toHaveBeenCalledTimes(1)
  // Two rooms are emitted from the `on` mock.
  expect(createListener).toHaveBeenCalledTimes(rooms.length + 2)
  expect(unsubscribe).toStrictEqual(expect.any(Function))
})
