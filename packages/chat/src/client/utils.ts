import { ClientEvent, type Listener, type ListenerMap, MatrixClient, type Room, RoomEvent } from 'matrix-js-sdk'

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
  const setRoomLevelEventListener = (room: Room) => {
    const handler = createListener(room)
    return () => room.off(RoomEvent.Timeline, handler)
  }

  // set listeners for initial existing rooms
  const roomUnsibscribers = rooms.map(setRoomLevelEventListener)

  // set client level listeners on new rooms comming
  const setClientLevelRoomListener = (room: Room) => {
    const hasRoom = rooms.some((r) => r.roomId === room.roomId)
    if (!hasRoom) return

    const unsubscribe = setRoomLevelEventListener(room)
    roomUnsibscribers.push(unsubscribe)
  }

  client.on(ClientEvent.Room, setClientLevelRoomListener)

  // return function to unsubscribe from all rooms and client
  return () => {
    client.off(ClientEvent.Room, setClientLevelRoomListener)
    roomUnsibscribers.forEach((func) => func())
  }
}
