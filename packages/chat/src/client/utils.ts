import { type MatrixClient, type Room, RoomEvent } from 'matrix-js-sdk'

import type { NotificationCount } from '@holi/chat/src/client/types'

export const hasMxClient = (client: MatrixClient | null): client is MatrixClient => !!client

export const setUnreadNotificationHandlers = (
  rooms: Room[],
  callback: (roomId: string, notificationCount?: NotificationCount) => void
): (() => void) => {
  // Collects all the handlers to unlisten to them later on when we unsubscribe
  const handlers: ((notificationCount?: NotificationCount) => void)[] = []

  rooms.forEach((room) => {
    const handler = (notificationCount?: NotificationCount) => void callback(room.roomId, notificationCount)
    handlers.push(handler)

    room.on(RoomEvent.UnreadNotifications, handler)
  })

  return () => {
    rooms.forEach((room, idx) => void room.off(RoomEvent.UnreadNotifications, handlers[idx]))
  }
}
