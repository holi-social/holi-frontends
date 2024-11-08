import { t } from 'i18next'
import {
  Direction,
  EmittedEvents,
  EventEmitterEvents,
  EventTimeline,
  EventTimelineSet,
  EventType,
  IContent,
  IEvent,
  IStateEventWithRoomId,
  MatrixClient,
  MatrixEvent,
  Room,
  RoomEvent,
  RoomMember,
  RoomState,
  createClient,
} from 'matrix-js-sdk'

import ChatClient from '@holi/chat/src/client/ChatClient'
import { ChatRoom, ChatRoomMember, MembershipStatus } from '@holi/chat/src/client/types'

const chatClientOptions = {
  baseUrl: 'chat.holi.social',
  accessToken: 'syt_p',
  deviceId: 'DKIEMZVXAM',
  freshLogin: true,
  userId: '@someone:chat.holi.social',
}

export const createChatClient = () => new ChatClient(chatClientOptions, t)

export type Mutable<T> = { -readonly [P in keyof T]: T[P] }
export const asMutable = <T>(value: T) => value as Mutable<T>

export const createMatrixClientMock = () => {
  const mxClient = jest.mocked(new MatrixClient({ baseUrl: '' }))
  mxClient.getIgnoredUsers.mockReturnValue([])
  mxClient.getRooms.mockReturnValue([])
  mxClient.roomState.mockImplementation(async () => ({}) as Promise<IStateEventWithRoomId[]>)

  const createClientMock = jest.mocked(createClient)
  createClientMock.mockReturnValue(mxClient)

  const EventTimelineSetMock = jest.mocked(EventTimelineSet)
  const eventTimelineSet = jest.mocked(new EventTimelineSet(undefined))
  EventTimelineSetMock.mockReturnValue(eventTimelineSet)
  eventTimelineSet.getLiveTimeline.mockReturnValue(new EventTimeline(eventTimelineSet))

  return mxClient
}

interface RoomMockOptions {
  name?: string
  isSpaceRoom?: boolean
  memberMocks?: RoomMember[]
  members?: ChatRoomMember[]
  timelineEvents?: MatrixEvent[]
  creatorId?: string
  myMembership?: MembershipStatus
  unreadNotificationCount?: number
  getMember?: ChatRoomMember
  stateEvents?: MatrixEvent[] | undefined
  timestamp?: number
}

export const createRoomMock = (
  roomId: string,
  {
    name,
    isSpaceRoom = false,
    members = [],
    memberMocks,
    timelineEvents,
    creatorId,
    myMembership,
    timestamp,
    stateEvents = [],
    unreadNotificationCount = 0,
    getMember,
  }: RoomMockOptions = {}
) => {
  const room = jest.mocked(new Room('', {} as MatrixClient, ''))
  // room setup
  asMutable(room).roomId = roomId
  room.isSpaceRoom.mockReturnValue(isSpaceRoom)
  room.getUnreadNotificationCount.mockReturnValue(unreadNotificationCount)

  if (name) room.name = name
  if (timestamp) room.getLastActiveTimestamp.mockReturnValue(timestamp)
  if (creatorId) room.getCreator.mockReturnValue(creatorId)
  if (members) {
    room.getMembers.mockReturnValue(members.map(roomMemberToMock))
  }
  if (memberMocks) {
    room.getMembers.mockReturnValue(memberMocks)
  }
  if (myMembership) room.getMyMembership.mockReturnValue(myMembership)
  if (getMember) room.getMember.mockReturnValue(roomMemberToMock(getMember))

  if (timelineEvents) {
    const eventTimeline = new EventTimeline({} as EventTimelineSet) as jest.Mocked<EventTimeline>
    room.getLiveTimeline.mockReturnValue(eventTimeline)
    eventTimeline.getEvents.mockReturnValue(timelineEvents)
    /* eslint-disable @typescript-eslint/no-unused-vars */
    eventTimeline.getState.mockImplementation((_direction: Direction): RoomState | undefined => {
      const getStateEvents = jest.fn().mockImplementation((eventType: EventType | string) => {
        return stateEvents.filter((event) => event.getType() === eventType)
      })

      return { getStateEvents } as unknown as RoomState
    })
  }

  return room
}

export const createRoomStateMock = (roomId: string) => {
  // because new Room() is a mock the arguments in constructor do not matter
  const roomState = jest.mocked(new RoomState(''))

  // room setup
  asMutable(roomState).roomId = roomId

  return roomState
}

export const roomMemberToMock = (m: ChatRoomMember) => {
  return createRoomMemberMock(m.id, m.name, m.membership, m.avatar)
}

export const createRoomMemberMock = (userId: string, name?: string, membership?: string, avatarUrl?: string) => {
  // because new RoomMember() is a mock the arguments in constructor do not matter
  const roomMember = jest.mocked(new RoomMember('', ''))

  asMutable(roomMember).userId = userId
  if (name) roomMember.name = name
  if (membership) roomMember.membership = membership
  if (avatarUrl) roomMember.getAvatarUrl.mockReturnValue(avatarUrl)

  return roomMember
}

interface MemberMockOptions {
  userId: string
  name?: string
  membership?: string
  avatarUrl?: string
}

export const createRoomMembersMock = (membersOptions: MemberMockOptions[]) => {
  return membersOptions.map(({ userId, name, membership, avatarUrl }) =>
    createRoomMemberMock(userId, name, membership, avatarUrl)
  )
}

export const getListenerForMatrixEvent = (
  mxClientOrRoom: jest.Mocked<MatrixClient> | jest.Mocked<Room>,
  event: EmittedEvents | EventEmitterEvents | RoomEvent,
  functionName?: string // additionally filter for listener function name, when more listeners are registered for the same event
) => {
  // filter the calls where the first parameter is the passed in event
  let calls = mxClientOrRoom.on.mock.calls.filter(([e]) => e === event)
  if (functionName) calls = calls.filter(([, fn]) => fn.name === functionName) // in addition filter for correct functionName
  return calls[0]?.[1] // return the second argument passed into the found call
}

export const createMatrixEventMock = (type: string, roomId?: string, content?: IContent, effectiveEvent?: IEvent) => {
  const event = jest.mocked(new MatrixEvent())

  // event setup
  event.getType.mockReturnValue(type)
  event.getTs = jest.fn()
  if (roomId) event.getRoomId.mockReturnValue(roomId)
  if (content) {
    event.getContent.mockReturnValue(content)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    event.event = { content } as any
  }
  if (effectiveEvent) event.getEffectiveEvent.mockReturnValue(effectiveEvent)

  return event
}

const creatorFixture: ChatRoomMember = {
  avatar: 'https://unsplash.com/photos/a-black-and-white-photo-of-a-diamond-vbPk2tB2HrU',
  id: '@creator.kato:holi.social',
  membership: MembershipStatus.join,
  name: 'creator',
}

interface ChatRoomFixtureOptions {
  name?: string
  creator?: ChatRoomMember
  members?: ChatRoomMember[]
  notificationCount?: number
  timestamp?: number
}

export const createChatRoomResult = (
  roomId: string,
  {
    name = 'room-name',
    creator = creatorFixture,
    members = [creatorFixture],
    notificationCount = 0,
    timestamp,
  }: ChatRoomFixtureOptions
): ChatRoom => {
  return {
    avatar: undefined,
    creator,
    hasInvitation: false,
    id: roomId,
    lastMessage: undefined,
    members,
    name,
    notificationCount,
    timestamp,
    type: 'private',
  }
}
