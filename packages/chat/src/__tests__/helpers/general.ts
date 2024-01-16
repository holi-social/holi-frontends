import {
  EmittedEvents,
  EventEmitterEvents,
  EventTimeline,
  EventTimelineSet,
  IContent,
  MatrixClient,
  MatrixEvent,
  Room,
  RoomEvent,
  RoomMember,
  RoomState,
  createClient,
} from 'matrix-js-sdk'

import { MembershipStatus } from '@holi/chat/src/client/types'

export const getClientOptions = (token: string) => ({
  baseUrl: 'chat.holi.social',
  accessToken: token,
  deviceId: 'DKIEMZVXAM',
  freshLogin: true,
  userId: '@someone:chat.holi.social',
})

export type Mutable<T> = { -readonly [P in keyof T]: T[P] }
export const asMutable = <T>(value: T) => value as Mutable<T>

export const createMatrixClientMock = () => {
  const mxClient = jest.mocked(new MatrixClient({ baseUrl: '' }))
  const createClientMock = jest.mocked(createClient)
  createClientMock.mockReturnValue(mxClient)

  const EventTimelineSetMock = jest.mocked(EventTimelineSet)
  const eventTimelineSet = jest.mocked(new EventTimelineSet(undefined))
  EventTimelineSetMock.mockReturnValue(eventTimelineSet)
  eventTimelineSet.getLiveTimeline.mockReturnValue(new EventTimeline(eventTimelineSet))

  return mxClient
}

interface RoomMockOptions {
  isSpaceRoom?: boolean
  members?: RoomMember[]
  timelineEvents?: MatrixEvent[]
}

export const createRoomMock = (
  roomId: string,
  { isSpaceRoom = false, members = [], timelineEvents }: RoomMockOptions = {}
) => {
  const room = jest.mocked(new Room('', {} as MatrixClient, ''))

  // room setup
  asMutable(room).roomId = roomId
  room.isSpaceRoom.mockReturnValue(isSpaceRoom)
  room.getMembers.mockReturnValue(members)
  if (timelineEvents) {
    const eventTimeline = new EventTimeline({} as EventTimelineSet) as jest.Mocked<EventTimeline>
    room.getLiveTimeline.mockReturnValue(eventTimeline)
    eventTimeline.getEvents.mockReturnValue(timelineEvents)
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

export const createRoomMemberMock = (
  userId: string,
  name?: string,
  membership?: MembershipStatus,
  avatarUrl?: string
) => {
  // because new RoomMember() is a mock the arguments in constructor do not matter
  const roomMember = jest.mocked(new RoomMember('', ''))

  asMutable(roomMember).userId = userId
  if (name) roomMember.name = name
  if (membership) roomMember.membership = membership
  if (avatarUrl) roomMember.getAvatarUrl.mockReturnValue(avatarUrl)

  return roomMember
}

export const getListenerForMatrixEvent = (
  event: EmittedEvents | EventEmitterEvents | RoomEvent,
  mxClientOrRoom: jest.Mocked<MatrixClient> | jest.Mocked<Room>,
  functionName?: string // additionally filter for listener function name, when more listeners are registered for the same event
) => {
  // filter the calls where the first parameter is the passed in event
  let calls = mxClientOrRoom.on.mock.calls.filter(([e]) => e === event)
  if (functionName) calls = calls.filter(([, fn]) => fn.name === functionName) // in addition filter for correct functionName
  return calls[0]?.[1] // return the second argument passed into the found call
}

export const createMatrixEventMock = (type: string, content?: IContent) => {
  const event = jest.mocked(new MatrixEvent())

  // event setup
  event.getType.mockReturnValue(type)
  if (content) event.getContent.mockReturnValue(content)

  return event
}
