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
  createClient,
} from 'matrix-js-sdk'

import { MutableMock } from './types'

export const getClientOptions = (token: string) => ({
  baseUrl: 'chat.holi.social',
  accessToken: token,
  deviceId: 'DKIEMZVXAM',
  freshLogin: true,
  userId: '@mau:local.chat.holi.social',
})

export const toMutableMockType = <T>(value: T): MutableMock<T> => value as jest.Mocked<T> as MutableMock<T>

export const toOriginalType = <T>(value: MutableMock<T>) => value as T

export const createMatrixClientMock = (): MutableMock<MatrixClient> => {
  const mxClient = new MatrixClient({ baseUrl: '' }) as jest.Mocked<MatrixClient>
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
  const room = toMutableMockType(new Room(roomId, {} as MatrixClient, 'creator'))

  // room setup
  room.roomId = roomId
  room.isSpaceRoom.mockReturnValue(isSpaceRoom)
  room.getMembers.mockReturnValue(members)

  return room
}

export const createRoomMemberMock = (userId: string) => {
  // because new RoomMember() is a mock the arguments in constructor do not matter
  const roomMember = toMutableMockType(new RoomMember('dummyRoomId', userId))

  roomMember.userId = userId

  return roomMember
}

export const getListenerForMatrixEvent = (
  event: EmittedEvents | EventEmitterEvents | RoomEvent,
  mxClientOrRoom: MutableMock<MatrixClient> | MutableMock<Room>
) => {
  return mxClientOrRoom.on.mock.calls.find(([e]) => e === event)?.[1]
}

export const createMatrixEventMock = (type: string) => {
  const event = toMutableMockType(new MatrixEvent())

  // event setup
  event.getType.mockReturnValue(type)

  return event
}
