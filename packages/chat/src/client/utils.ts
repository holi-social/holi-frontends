import {
  ClientEvent,
  type Listener,
  type ListenerMap,
  MatrixClient,
  MatrixEvent,
  type Room,
  RoomEvent,
} from 'matrix-js-sdk'

type RoomListener = Listener<RoomEvent, ListenerMap<RoomEvent>, RoomEvent>

/**
 *
 * @name addRoomEventListener
 * @description A partial function application that helps set/add listeners in a room
 * event and return the listener for later unsetting (unsubscribing) the
 * listener. It's useful when collecting listeners for later unsetting them in a
 * bulk manner.
 */
export const addRoomEventListener =
  (roomEvent: RoomEvent, roomListener: (room: Room) => RoomListener) => (room: Room) => {
    const listener = roomListener(room)
    room.on(roomEvent, listener)

    return listener
  }

/**
 *
 * @name createRoomsListeners
 * @description A partial function application that collects and sets a
 * pre-defined listener to every existing room. The produced function also
 * listens to any rooms coming in and recursively sets the listeners for these
 * rooms. The final return result is an unsubscribe function that removes all
 * the already set listeners.
 */
export const createRoomsListeners = (
  client: MatrixClient,
  rooms: Room[],
  createListener: (room: Room) => RoomListener
) => {
  const addRoomListeners = (room?: Room, incomingListeners: ((event: MatrixEvent) => void)[] = []) => {
    const listeners = room ? incomingListeners : rooms.map(createListener)

    const roomEventListener = (room: Room) => {
      const hasRoomIdx = rooms.findIndex((r) => r.roomId === room.roomId)
      if (hasRoomIdx > 0) return

      addRoomListeners(room, [...incomingListeners, createListener(room)])
    }

    client.on(ClientEvent.Room, roomEventListener)

    return () => {
      client.off(ClientEvent.Room, roomEventListener)
      client.getRooms().forEach((room, idx) => room.off(RoomEvent.Timeline, listeners[idx]))
    }
  }

  return addRoomListeners
}
