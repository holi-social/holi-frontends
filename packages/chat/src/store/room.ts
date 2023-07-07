import type { MatrixEvent } from 'matrix-js-sdk'

import type { ChatMessage } from '@holi/chat/src/store/types'

export const createRoomMessage = (roomId: string, event: MatrixEvent): ChatMessage => {
  const timestamp = event.getTs()
  return {
    timestamp,
    content: event.getContent(),
    room_id: roomId,
    sender: event.getSender(),
    id: event.getId() ?? event.getContent().body + timestamp,
  }
}
