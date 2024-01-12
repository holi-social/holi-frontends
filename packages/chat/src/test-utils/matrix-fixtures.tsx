import { ChatMsgTextContent, ChatRoomMember, ChatRoomMessage, MembershipStatus } from '@holi/chat/src/client/types'
import { ChatRoom } from '@holi/chat/src/store'

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
    membership: MembershipStatus.Joined,
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
