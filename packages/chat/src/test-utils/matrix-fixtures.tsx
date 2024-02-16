import { EventType, IContent, IEvent, MatrixClient, MatrixEvent, Room } from 'matrix-js-sdk'
import { act } from 'react-test-renderer'

import {
  ChatMsgTextContent,
  ChatRoom,
  ChatRoomMember,
  ChatRoomMessage,
  MembershipStatus,
} from '@holi/chat/src/client/types'
import { createChatRoomResult, createMatrixEventMock, createRoomMock } from '@holi/chat/src/test-utils/matrix-general'

import { CHAT_ROOM_NAME_MOCK } from './matrix-mock-setup'

export function createChatRoomFixture(overrides?: Partial<ChatRoom>): ChatRoom {
  const creator = overrides?.creator ? overrides.creator : createChatMemberFixture()
  const hasMembers = Boolean(overrides?.members) && Array.isArray(overrides?.members)

  const defaultRoom: ChatRoom = {
    id: overrides?.id ?? CHAT_ROOM_NAME_MOCK,
    name: overrides?.name ?? 'defaultRoomName',
    hasInvitation: true,
    notificationCount: 0,
    lastMessage: undefined,
    creator: creator,
    members: [creator, ...(hasMembers ? (overrides?.members as ChatRoomMember[]) : [])],
    senderId: creator.id ?? 'defaultSenderId',
    timestamp: new Date().getTime(),
  } as ChatRoom

  return { ...defaultRoom, ...overrides } as ChatRoom
}

export function createChatMemberFixture(overrides?: Partial<ChatRoomMember>): ChatRoomMember {
  const identity = overrides?.name ? overrides.name + 'Identity' : 'defaultUserIdentity'

  const defaultChatMember: ChatRoomMember = {
    name: overrides?.name ?? 'defaultUserName',
    id: `@${identity}:test.chat`,
    membership: MembershipStatus.join,
  }
  return { ...defaultChatMember, ...overrides }
}

export function createChatMessageFixture(
  overrides?: Partial<ChatRoomMessage> | string,
  sender?: ChatRoomMember,
  room?: ChatRoom
): ChatRoomMessage {
  const defaultMessage: ChatRoomMessage = {
    type: 'message',
    id: 'defaultMessageId',
    content: {
      body: 'Default chat message',
      msgtype: 'm.text',
    },
    timestamp: new Date().getTime(),
    roomId: 'defaultRoomId',
    sender: 'defaultSenderId',
  }

  let fixture = { ...defaultMessage } as unknown as ChatRoomMessage

  if (typeof overrides === 'string') {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;(fixture.content as ChatMsgTextContent).body = overrides
  } else {
    fixture = { ...fixture, ...overrides }

    const bodyContentOverride = (overrides?.content as ChatMsgTextContent)?.body
    if (bodyContentOverride) {
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;(defaultMessage.content as ChatMsgTextContent).body = bodyContentOverride
    }
  }

  if (room) {
    fixture.roomId = room.id
  }

  if (sender) {
    fixture.sender = sender.id
  }

  return fixture
}

// Message helpers
export const msgEvent = (roomId: string, senderId: string, eventNr: number): IEvent => {
  return {
    state_key: 'dummy',
    event_id: 'id_' + eventNr,
    type: EventType.RoomMessage,
    sender: senderId,
    origin_server_ts: eventNr,
    unsigned: {},
    room_id: roomId,
    content: {
      body: 'message body ' + eventNr,
    } as IContent,
  }
}

export const expectedMsgForEvent = (e: IEvent): ChatRoomMessage => {
  return {
    id: e.event_id,
    timestamp: e.origin_server_ts,
    roomId: e.room_id || '',
    type: 'message',
    sender: e.sender,
    content: {
      body: e.content.body,
      msgtype: 'm.text',
    },
  }
}

export const sendMessageEvent = (
  listener: (event: MatrixEvent, room: Room | undefined) => void,
  roomMock: Room,
  senderId: string,
  eventNr: number
) => {
  const event = msgEvent(roomMock.roomId, senderId, eventNr)
  const eventMock = createMatrixEventMock(EventType.RoomMessage, roomMock.roomId, {}, event)

  act(() => listener(eventMock, roomMock))

  const message = expectedMsgForEvent(event)
  return { message, event, eventMock }
}

// Room helpers
export const creator: ChatRoomMember = {
  avatar: 'https://unsplash.com/photos/a-black-and-white-photo-of-a-diamond-vbPk2tB2HrU',
  id: '@room.creator:holi.social',
  membership: MembershipStatus.join,
  name: 'room creator',
}
export const member: ChatRoomMember = {
  avatar: 'https://unsplash.com/photos/a-group-of-blue-and-orange-shapes-on-a-white-surface-g0lR2cThaR0',
  id: '@a.member:holi.social',
  membership: MembershipStatus.join,
  name: 'a member',
}

interface InitChatRoomOptions {
  roomId?: string
  roomCreator?: ChatRoomMember
  roomMember?: ChatRoomMember
  timestamp?: number
}

export const initChatRoomFixture = (
  mxClient: jest.MockedObjectDeep<MatrixClient>,
  { roomId = 'roomId', roomCreator = creator, roomMember = member, timestamp }: InitChatRoomOptions
) => {
  const members = [roomCreator, roomMember]
  const roomMock = createRoomMock(roomId, {
    name: 'roomName',
    members: members,
    timelineEvents: [],
    creatorId: roomCreator.id,
    myMembership: MembershipStatus.join,
    unreadNotificationCount: 0,
    getMember: creator,
    timestamp,
  })

  mxClient.getRooms.mockReturnValue([roomMock])
  mxClient.roomState.mockReturnValue(Promise.resolve([]))

  const room = createChatRoomResult(roomId, { name: 'roomName', creator: roomCreator, members, timestamp })

  return { roomMock, room, creator: roomCreator, member: roomMember }
}
