import { EmittedEvents, EventEmitterEvents, MatrixClient, MatrixEvent, Room, RoomMember } from 'matrix-js-sdk'

import { MutableMock } from './types'

export const getClientOptions = (token: string) => ({
  baseUrl: 'chat.holi.social',
  accessToken: token,
  deviceId: 'DKIEMZVXAM',
  freshLogin: true,
  userId: '@mau:local.chat.holi.social',
})

export class MockTransformer {
  static toMutableMockType = <T>(value: T): MutableMock<T> => value as jest.Mocked<T> as MutableMock<T>

  static toOriginalType = <T>(value: MutableMock<T>) => value as T
}

export const createRoomMock = (
  roomId: string,
  { isSpaceRoom = false, members = [] }: Partial<{ isSpaceRoom: boolean; members: RoomMember[] }> = {}
) => {
  // because new Room() is a mock the arguments in constructor do not matter
  const room = MockTransformer.toMutableMockType(new Room(roomId, {} as MatrixClient, 'creator'))

  // room setup
  room.roomId = roomId
  room.isSpaceRoom.mockReturnValue(isSpaceRoom)
  room.getMembers.mockReturnValue(members)

  return room
}

export const createRoomMemberMock = (userId: string) => {
  // because new RoomMember() is a mock the arguments in constructor do not matter
  const roomMember = MockTransformer.toMutableMockType(new RoomMember('dummyRoomId', userId))

  roomMember.userId = userId

  return roomMember
}

export const getListenerForMatrixEvent = (
  event: EmittedEvents | EventEmitterEvents,
  mxClientOrRoom: MutableMock<MatrixClient> | MutableMock<Room>
) => {
  return mxClientOrRoom.on.mock.calls.find(([e]) => e === event)?.[1]
}

export const createMatrixEventMock = (type: string) => {
  const event = MockTransformer.toMutableMockType(new MatrixEvent())

  // event setup
  event.getType.mockReturnValue(type)

  return event
}
