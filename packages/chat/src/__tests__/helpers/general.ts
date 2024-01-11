import {
  EmittedEvents,
  EventEmitterEvents,
  EventTimeline,
  EventTimelineSet,
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

export const createRoomMock = (
  roomId: string,
  { isSpaceRoom = false, members = [] }: Partial<{ isSpaceRoom: boolean; members: RoomMember[] }> = {}
) => {
  // because new Room() is a mock the arguments in constructor do not matter
  const room = jest.mocked(new Room('', {} as MatrixClient, ''))

  // room setup
  asMutable(room).roomId = roomId
  room.isSpaceRoom.mockReturnValue(isSpaceRoom)
  room.getMembers.mockReturnValue(members)

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
  mxClientOrRoom: jest.Mocked<MatrixClient> | jest.Mocked<Room>
) => {
  // find the call where the first parameter is the passed in event and return the second parameter of that call
  return mxClientOrRoom.on.mock.calls.find(([e]) => e === event)?.[1]
}

export const createMatrixEventMock = (type: string) => {
  const event = jest.mocked(new MatrixEvent())

  // event setup
  event.getType.mockReturnValue(type)

  return event
}
