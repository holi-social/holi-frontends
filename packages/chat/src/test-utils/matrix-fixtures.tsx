import { ChatRoomMember, MembershipStatus } from '@holi/chat/src/client/types'
import { ChatMessage, ChatRoom } from '@holi/chat/src/store'

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
  }

  return { ...defaultRoom, ...overrides }
}

export function createChatMemberFixture(overrides?: Partial<ChatRoomMember>): ChatRoomMember {
  const identity = overrides?.name ? overrides.name + 'Identity' : 'defaultUserIdentity'

  const defaultChatMember: ChatRoomMember = {
    name: overrides?.name ?? 'defaultUserName',
    id: `@${identity}:test.chat`,
    membership: MembershipStatus.Joined,
  }
  return { ...defaultChatMember, ...overrides }
}

export function createChatMessageFixture(
  overrides?: Partial<ChatMessage> | string,
  sender?: ChatRoomMember,
  room?: ChatRoom
): ChatMessage {
  const defaultMessage: ChatMessage = {
    id: 'defaultMessageId',
    content: {
      body: 'Default chat message',
      msgtype: 'm.text',
    },
    timestamp: new Date().getTime(),
    room_id: 'defaultRoomId',
    sender: 'defaultSenderId',
  }

  let fixture = { ...defaultMessage }

  if (typeof overrides === 'string') {
    fixture.content.body = overrides
  } else {
    fixture = { ...fixture, ...overrides }

    const bodyContentOverride = overrides?.content?.body
    if (bodyContentOverride) {
      defaultMessage.content.body = bodyContentOverride
    }
  }

  if (room) {
    fixture.room_id = room.id
  }

  if (sender) {
    fixture.sender = sender.id
  }

  return fixture
}
