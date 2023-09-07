import type { Mock } from 'jest'
import { Room, RoomEvent } from 'matrix-js-sdk'

import { addRoomEventListener } from '@holi/chat/src/client/utils'

const createRoomMock = (): [Mock<Room>, Mock<() => void>] => {
  const onMock = jest.fn()
  const RoomMock = jest.fn().mockImplementation(() => {
    return { on: onMock }
  })

  return [RoomMock, onMock]
}

it('addRoomEventListener - should have set the listener in a room and return it', () => {
  const [Room, on] = createRoomMock()
  const room = new Room()
  const handler = jest.fn((room) => () => room)

  const incomingMessagesListener = addRoomEventListener(RoomEvent.Timeline, handler)
  const listener = incomingMessagesListener(room)

  expect(handler).toHaveBeenCalledTimes(1)
  expect(handler).toHaveBeenCalledWith(room)
  expect(on).toHaveBeenCalledTimes(1)
  expect(on).toHaveBeenCalledWith(RoomEvent.Timeline, expect.any(Function))
  expect(typeof listener === 'function').toBeTruthy()
})
