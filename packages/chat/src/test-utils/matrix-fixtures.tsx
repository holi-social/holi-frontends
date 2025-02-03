import { EventType, type IContent, type IEvent, type MatrixClient, type MatrixEvent, type Room } from 'matrix-js-sdk'

import { type ChatRoomMember, type ChatRoomMessage, MembershipStatus } from '@holi/chat/src/client/types'
import { createChatRoomResult, createMatrixEventMock, createRoomMock } from '@holi/chat/src/test-utils/matrix-mocks'
import type { User } from '@holi/core/domain/shared/types'
import { act } from '@testing-library/react-native'

export const DM_ROOM_ID = 'room-id'
export const NOTIFICATION_COUNT = 0
export const SPACE_ROOM_ID_FIXTURE = '!space.room:holi.social'
export const SPACE_ROOM_NAME_FIXTURE = 'space'
export const SPACE_CHILD_ROOM_ID_FIXTURE = '!general:holi.social'
export const SPACE_CHILD_ROOM_NAME_FIXTURE = '#general'
export const HOLI_SPACE_ID_FIXTURE = 'holi-uuid'
export const TIMESTAMP_FIXTURE = 1706703410441

export const ADMIN_FIXTURE: ChatRoomMember = {
  avatar: undefined,
  id: '@chat.admin:test.chat',
  membership: MembershipStatus.join,
  name: 'chat.admin',
}

export const CREATOR_FIXTURE: ChatRoomMember = {
  avatar: '',
  id: '@creator.kato:test.chat',
  membership: MembershipStatus.join,
  name: 'creator',
}

export const MEMBER1_FIXTURE: ChatRoomMember = {
  avatar: '',
  id: '@member1.feynman:test.chat',
  membership: MembershipStatus.join,
  name: 'member1',
}

export const MEMBER2_FIXTURE: ChatRoomMember = {
  avatar: '',
  id: '@nakamoto:test.chat',
  membership: MembershipStatus.join,
  name: 'member2',
}

export const HOLI_CREATOR_ID_FIXTURE = '5dbeb15e-1fac-4292-96fc-9fbe2e6edbb0'
export const HOLI_CREATOR_FIXTURE: User = {
  id: HOLI_CREATOR_ID_FIXTURE,
  identity: 'creator.kato',
  avatar: '',
  fullName: CREATOR_FIXTURE.name,
  firstName: CREATOR_FIXTURE.name,
  lastName: 'J',
  aboutMe: 'howdy!',
  avatarDefaultColor: '#7571EC',
  avatarLabel: 'CJ',
}

export const HOLI_MEMBER1_ID_FIXTURE = '1fac-4292-96fc-9fbe2e6edbb0'
export const HOLI_MEMBER1_FIXTURE: User = {
  id: HOLI_MEMBER1_ID_FIXTURE,
  identity: 'member1.feynman',
  avatar: '',
  fullName: MEMBER1_FIXTURE.name,
  firstName: MEMBER1_FIXTURE.name,
  lastName: 'Feynman',
  aboutMe: '',
  avatarDefaultColor: 'papayawhip',
  avatarLabel: 'RF',
}

export const HOLI_MEMBER2_ID_FIXTURE = '96fc-9fbe2e6edbb0'
export const HOLI_MEMBER2_FIXTURE: User = {
  id: HOLI_MEMBER1_ID_FIXTURE,
  identity: 'nakamoto',
  avatar: '',
  fullName: MEMBER2_FIXTURE.name,
  firstName: MEMBER2_FIXTURE.name,
  lastName: 'Nakamoto',
  aboutMe: '',
  avatarDefaultColor: 'papayawhip',
  avatarLabel: 'NM',
}

export const DM_MEMBERS = [CREATOR_FIXTURE, MEMBER1_FIXTURE, MEMBER2_FIXTURE]
export const SPACE_MEMBERS_FIXTURE = [ADMIN_FIXTURE, MEMBER1_FIXTURE, MEMBER2_FIXTURE]
export const HOLI_DM_USERS_FIXTURE = [HOLI_CREATOR_FIXTURE, HOLI_MEMBER1_FIXTURE, HOLI_MEMBER2_FIXTURE]
export const HOLI_SPACE_USERS_FIXTURE = [HOLI_MEMBER1_FIXTURE, HOLI_MEMBER2_FIXTURE]

export const SPACE_EVENT_CONTENT = {
  holiSpaceId: HOLI_SPACE_ID_FIXTURE,
  roomId: SPACE_ROOM_ID_FIXTURE,
}

export const SPACE_CHILD_EVENT_CONTENT = {
  ...SPACE_EVENT_CONTENT,
  spaceName: SPACE_ROOM_NAME_FIXTURE,
  avatarDefaultColor: '#7BD7EA',
  parentSpaceRoomId: SPACE_ROOM_ID_FIXTURE,
}

export const fakeRoomMessageEvent = (roomId: string, senderId: string, eventNr: number): IEvent => {
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

export const fakeUnrenderedEvent = (roomId: string, senderId: string, eventNr: number): IEvent => {
  return {
    state_key: 'someStateKey',
    event_id: 'id_' + eventNr,
    type: EventType.Dummy,
    sender: senderId,
    origin_server_ts: eventNr,
    unsigned: {},
    room_id: roomId,
    content: {},
  }
}

export const fakeChatRoomMessageFrom = (e: IEvent): ChatRoomMessage => {
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
  const event = fakeRoomMessageEvent(roomMock.roomId, senderId, eventNr)
  const eventMock = createMatrixEventMock(EventType.RoomMessage, roomMock.roomId, {}, event)

  act(() => listener(eventMock, roomMock))

  const message = fakeChatRoomMessageFrom(event)
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
  { roomId = 'roomId', roomCreator = creator, roomMember = member, timestamp }: InitChatRoomOptions = {}
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
