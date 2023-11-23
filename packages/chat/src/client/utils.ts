import {
  ClientEvent,
  EventType,
  type IContent,
  type IEvent,
  type IRoomEvent,
  type IStateEvent,
  type IStateEventWithRoomId,
  type Listener,
  type ListenerMap,
  MatrixClient,
  MatrixEvent,
  type Room,
  RoomEvent,
} from 'matrix-js-sdk'

import {
  ChatRoomEvent,
  type RoomWithSharedData,
  type SharedDataContent,
  type SpaceChildSharedDataContent,
} from '@holi/chat/src/client/types'
import { CHAT_ADMIN_USER_ID } from '@holi/chat/src/utils'

type RoomListener = Listener<RoomEvent, ListenerMap<RoomEvent>, RoomEvent>

export const isSpaceRoom = (room: Room) => room.isSpaceRoom()

export const isEventWithSharedData = (event: IStateEventWithRoomId): boolean => event.type === ChatRoomEvent.SharedData

export const isSharedDataContent = (content: IContent): content is SharedDataContent => {
  return !!content && content?.holiSpaceId
}

export const isSpaceGeneralRoomContent = (content: SharedDataContent): content is SpaceChildSharedDataContent => {
  return !!content && 'parentSpaceRoomId' in content
}

export const isIStateEvent = (event: IRoomEvent | IStateEvent): event is IStateEvent => 'state_key' in event

export const isAdminChangeToMembership = (event: MatrixEvent, userId: string, loggedInUserId: string | null) => {
  return isMembershipEvent(event) && userId === loggedInUserId && event.getSender() === CHAT_ADMIN_USER_ID
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

export const getLastMessageEvent = (room: Room): Partial<IEvent> | undefined => {
  const timelineEvents = room.getLiveTimeline().getEvents()
  return [...timelineEvents].reverse().find((event) => event.getType() === EventType.RoomMessage)?.event
}

export const isSpaceChildEvent = (event: MatrixEvent) => event.getType() === 'm.space.child'

export const isMembershipEvent = (event: MatrixEvent) => event.getType() === 'm.room.member'
