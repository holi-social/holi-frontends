import type { MatrixEvent } from 'matrix-js-sdk'

import type { ChatMessage } from '@holi/chat/src/store/types'

export const createRoomMessage = (roomId: string, event: MatrixEvent): ChatMessage => {
  const ts = event.getTs()
  return {
    ts,
    content: event.getContent(),
    room_id: roomId,
    sender: event.getSender(),
    id: event.getId() ?? event.getContent().body + ts,
  }
}
