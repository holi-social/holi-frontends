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
  RoomMember,
} from 'matrix-js-sdk'

import {
  ChatMsgMemberContent,
  ChatMsgTextContent,
  ChatRoomEvent,
  ChatRoomMember,
  ChatRoomMessage,
  MatrixId,
  MembershipStatus,
  RoomType,
  RoomUpdatesType,
  type RoomWithSharedData,
  type SharedDataContent,
  type SpaceChildSharedDataContent,
} from '@holi/chat/src/client/types'
import { HoliError } from '@holi/core/errors/classes/HoliError'
import { chatAdminUserId } from '@holi/core/helpers/config'

/**
 * Rooms
 */

type RoomListener = Listener<RoomEvent, ListenerMap<RoomEvent>, RoomEvent>

export const isSpaceRoom = (room: Room) => room.isSpaceRoom()

export const isEventWithSharedData = (event: IStateEventWithRoomId): boolean => event.type === ChatRoomEvent.SharedData

export const isSharedDataContent = (content: IContent): content is SharedDataContent => {
  return !!content && content?.holiSpaceId
}

export const isSpaceGeneralRoomContent = (content: SharedDataContent): content is SpaceChildSharedDataContent => {
  return !!content && 'parentSpaceRoomId' in content
}

export const isSpaceChildEvent = (event: MatrixEvent) => event.getType() === EventType.SpaceChild

export const isIRoomEvent = (event: IRoomEvent | Partial<IEvent>): event is IRoomEvent =>
  ['event_id', 'sender', 'origin_server_ts'].every((key) => key in event)

export const isIStateEvent = (event: IRoomEvent | IStateEvent): event is IStateEvent => 'state_key' in event

export const createInitialRoom = (room: Room): RoomWithSharedData => ({
  type: 'private',
  room: room,
})

export const hasRoomUpdatesType = (type: unknown): type is RoomUpdatesType => {
  return type === RoomUpdatesType.avatar || type === RoomUpdatesType.name
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

/**
 * Membership
 */

export const isMembershipEvent = (event: MatrixEvent): boolean => event.getType() === EventType.RoomMember

export const isJoinOrLeaveEvent = (event: MatrixEvent) =>
  ['join', 'leave'].some((m) => m === event.getContent().membership)

export const isAdminChangeToMembership = (event: MatrixEvent, userId: string, loggedInUserId: string | null) => {
  return isMembershipEvent(event) && userId === loggedInUserId && event.getSender() === chatAdminUserId
}

export const isRoomMemberEvent = (event: IRoomEvent | Partial<IEvent> | undefined): event is IRoomEvent => {
  return event?.type === EventType.RoomMember && ['join', 'leave'].some((m) => m === event.content?.membership)
}

export const isMemberEventWithState = (event: IRoomEvent): event is IStateEvent => {
  return event?.type === EventType.RoomMember && 'prev_content' in event
}

/**
 * @description Whenever a room member changes their avatar or other member
 * information, we receive timeline events for the message thread
 * (`subscribeToRoomMessages`). We use these to show the chat messages and if a
 * user joined or left a room. Here, we confirm that it is not a duplicate
 * event. We consider a duplicate if it has the same membership as the current
 * one. `"join" === "join" || "leave" === "leave"` .
 */
export const hasDuplicateMembershipEvent = (room: Room, event: MatrixEvent): boolean => {
  if (!isMembershipEvent(event)) return false

  // The state_key in a membership event is the id of the user that changed the state
  const { state_key } = event.getEffectiveEvent()
  const content = event.getContent()
  const membership = room.getMember(state_key ?? '')?.membership

  return content.membership === membership
}

export const createChatMember = (member: RoomMember, avatarUrl: string | null): ChatRoomMember => {
  return {
    id: member.userId as MatrixId,
    name: member.name,
    avatar: avatarUrl ?? member.user?.avatarUrl,
    membership: MembershipStatus[member.membership as keyof typeof MembershipStatus],
  }
}

/**
 * Messages
 */

const createMsgTextContent = (body: string): ChatMsgTextContent => ({
  body,
  msgtype: 'm.text',
})

const createMsgMemberContent = (
  membership: string,
  options: { displayname?: string; avatar_url?: string } = {}
): ChatMsgMemberContent => ({
  ...(membership?.length > 0 ? { membership } : {}),
  ...(options.displayname ? { name: options.displayname } : {}),
  ...(options.avatar_url ? { avatar: options.avatar_url } : {}),
})

export const createChatMessage = (roomId: string, event: IEvent | IRoomEvent): ChatRoomMessage => {
  const base = {
    id: event.event_id,
    timestamp: event.origin_server_ts,
    roomId,
  }

  switch (event.type) {
    case EventType.RoomMessage:
      return {
        ...base,
        type: 'message',
        sender: event.sender,
        content: createMsgTextContent(event.content.body),
      }
    case EventType.RoomMember:
      return {
        ...base,
        type: 'membership',
        content: createMsgMemberContent(event.content.membership ?? '', { displayname: event.content.displayname }),
        sender: isIStateEvent(event) ? event.state_key : event.sender,
      }
    default:
      throw new HoliError('Unexpected RoomEvent: only EventType.RoomMessage and EventType.RoomMember are supported')
  }
}

/**
 * @description return an optional IRoomEvent for last supported message of the room.
 * for rooms of type:
 * - 'space' returns undefined, because we do not show rooms of this type
 * - 'space.child' supports 'm.room.message' and 'm.room.membership' events
 * - 'private' supports only 'm.room.message' events
 */
export const getLastMessageEvent = (room: Room, roomType: RoomType): IRoomEvent | undefined => {
  if (roomType === 'space') return undefined

  const timelineEvents = room.getLiveTimeline().getEvents()
  const event = timelineEvents.findLast((event) => {
    if (roomType === 'space.child') {
      return isMessageEvent(event) || (isMembershipEvent(event) && isJoinOrLeaveEvent(event))
    } else {
      return isMessageEvent(event)
    }
  })?.event

  return event && isIRoomEvent(event) ? event : undefined
}

export const isMessageEvent = (event: MatrixEvent) => event.getType() === EventType.RoomMessage

export const isRoomMessageEvent = (event: IRoomEvent | Partial<IEvent> | undefined): event is IRoomEvent => {
  return event?.type === EventType.RoomMessage
}

/**
 * @description It filters message events and member events messages. It also
 * removes member event message duplication. For example, when a user changes
 * their avatar or name, we don't want to provide a new member event to the
 * message timeline
 */
export const filterMessagesChunk = (chunk: IRoomEvent[]): IRoomEvent[] => {
  return chunk.reduce((events: IRoomEvent[], event: IRoomEvent) => {
    if (isRoomMemberEvent(event) && !isMemberEventWithState(event)) return [...events, event]
    if (isRoomMemberEvent(event)) {
      const prevMembership = event.prev_content?.membership
      const { membership } = event.content

      if (membership === prevMembership) return events

      return [...events, event]
    }

    if (isRoomMessageEvent(event)) return [...events, event]

    return events
  }, [])
}
