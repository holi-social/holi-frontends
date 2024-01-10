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

import { Membership } from '@holi/chat/src/client/types'

import { Mutable } from './types'

export const getClientOptions = (token: string) => ({
  baseUrl: 'chat.holi.social',
  accessToken: token,
  deviceId: 'DKIEMZVXAM',
  freshLogin: true,
  userId: '@mau:local.chat.holi.social',
})

export const asMocked = <T>(value: T): jest.Mocked<T> => value as jest.Mocked<T>
export const asMutable = <T>(value: T): Mutable<T> => value as Mutable<T>

export const createMatrixClientMock = () => {
  const mxClient = asMocked(new MatrixClient({ baseUrl: '' }))
  const createClientMock = createClient as jest.Mock<MatrixClient>
  createClientMock.mockReturnValue(mxClient)

  const EventTimelineSetMock = EventTimelineSet as jest.MockedClass<typeof EventTimelineSet>
  const eventTimelineSet = new EventTimelineSet(undefined) as jest.Mocked<EventTimelineSet>
  EventTimelineSetMock.mockReturnValue(eventTimelineSet)
  eventTimelineSet.getLiveTimeline.mockReturnValue(new EventTimeline(eventTimelineSet))

  return mxClient
}

export const createRoomMock = (
  roomId: string,
  { isSpaceRoom = false, members = [] }: Partial<{ isSpaceRoom: boolean; members: RoomMember[] }> = {}
) => {
  // because new Room() is a mock the arguments in constructor do not matter
  const room = asMocked(new Room(roomId, {} as MatrixClient, 'creator'))

  // room setup
  asMutable(room).roomId = roomId
  room.isSpaceRoom.mockReturnValue(isSpaceRoom)
  room.getMembers.mockReturnValue(members)

  return room
}

export const createRoomStateMock = (roomId: string) => {
  // because new Room() is a mock the arguments in constructor do not matter
  const roomState = asMocked(new RoomState(roomId))

  // room setup
  asMutable(roomState).roomId = roomId

  return roomState
}

export const createRoomMemberMock = (userId: string, name?: string, membership?: Membership, avatarUrl?: string) => {
  // because new RoomMember() is a mock the arguments in constructor do not matter
  const roomMember = asMocked(new RoomMember('dummyRoomId', userId))

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
  const event = asMocked(new MatrixEvent())

  // event setup
  event.getType.mockReturnValue(type)

  return event
}
