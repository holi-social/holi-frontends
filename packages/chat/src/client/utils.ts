import {
  ClientEvent,
  type IContent,
  type IStateEventWithRoomId,
  type Listener,
  type ListenerMap,
  MatrixClient,
  type Room,
  RoomEvent,
} from 'matrix-js-sdk'

import {
  ChatRoomEvent,
  type SharedDataContent,
  type SpaceGeneralRoomSharedDataContent,
} from '@holi/chat/src/client/types'

type RoomListener = Listener<RoomEvent, ListenerMap<RoomEvent>, RoomEvent>

export const isEventWithSharedData = (event: IStateEventWithRoomId): boolean => event.type === ChatRoomEvent.SharedData

export const isSharedDataContent = (content: IContent): content is SharedDataContent => {
  return !!content && content?.holiSpaceId
}

export const isSpaceGeneralRoomContent = (content: SharedDataContent): content is SpaceGeneralRoomSharedDataContent => {
  return !!content && 'parentSpaceRoomId' in content
}

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

interface CreateListenersArgs {
  client: MatrixClient
  roomEvent: RoomEvent
  rooms: Room[]
  createListener: (room: Room) => RoomListener
}

/**
 *
 * @name setRoomsListeners
 * @description collects and sets a pre-defined listener to every existing room.
 * It also listens to any rooms coming in settting the listeners for these
 * rooms. The final return result is an unsubscribe function that removes all
 * the already set listeners.
 */
export const setRoomsListeners = ({ client, roomEvent, rooms, createListener }: CreateListenersArgs) => {
  const setRoomLevelEventListener = (room: Room) => {
    const handler = createListener(room)
    return () => room.off(roomEvent, handler)
  }

  // set listeners for initial existing rooms
  const unsubscribers = rooms.map(setRoomLevelEventListener)

  // set client level listeners on new rooms comming
  const setClientLevelRoomListener = (room: Room) => {
    const hasRoom = rooms.some((r) => r.roomId === room.roomId)
    if (hasRoom) return

    const unsubscribe = setRoomLevelEventListener(room)

    unsubscribers.push(unsubscribe)
  }

  client.on(ClientEvent.Room, setClientLevelRoomListener)

  // return function to unsubscribe from all rooms and client
  return () => {
    client.off(ClientEvent.Room, setClientLevelRoomListener)
    unsubscribers.forEach((func) => func())
  }
}
