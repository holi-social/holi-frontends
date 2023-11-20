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
  type RoomType,
  type RoomWithSharedData,
  type SharedDataContent,
  type SpaceChildRoom,
  type SpaceChildSharedDataContent,
} from '@holi/chat/src/client/types'

type RoomListener = Listener<RoomEvent, ListenerMap<RoomEvent>, RoomEvent>

export const isSpaceChildRoom = (room: RoomWithSharedData): room is SpaceChildRoom => room.type === 'space.child'

export const isEventWithSharedData = (event: IStateEventWithRoomId): boolean => event.type === ChatRoomEvent.SharedData

export const isSharedDataContent = (content: IContent): content is SharedDataContent => {
  return !!content && content?.holiSpaceId
}

export const isSpaceGeneralRoomContent = (content: SharedDataContent): content is SpaceChildSharedDataContent => {
  return !!content && 'parentSpaceRoomId' in content
}

export const getRoomType = (room: Room): RoomType => {
  if (room.isSpaceRoom()) return 'space'
  // TODO: This predicate will only work for space rooms with only one child room
  if (room.name === '#general') return 'space.child'
  return 'private'
}

export const createInitialRoom = (room: Room): RoomWithSharedData => ({
  type: 'private',
  room: room,
})

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
