import { produce } from 'immer'
import { MatrixEvent } from 'matrix-js-sdk'

import type { ChatMessage } from '@holi/chat/src/store/types'

export const updateThread = produce((threads: ChatMessage[], msg: ChatMessage) => {
  const dupIndex = threads.findIndex((m) => m.id === msg.id)
  if (dupIndex === -1) {
    threads.push(msg)
    return
  }

  const m = { ...msg, ...threads[dupIndex] }
  threads.splice(dupIndex, 1)
  threads.push(m)
})

export function createChatMessage(roomId: string, event: MatrixEvent): ChatMessage {
  // TODO: handle empty strings fallback
  return {
    id: event.getId() ?? '',
    content: event.getContent(),
    timestamp: event.getTs(),
    room_id: roomId,
    sender: event.getSender(),
  }
}
