import { produce } from 'immer'
import { MatrixEvent } from 'matrix-js-sdk'

import type { ChatMessage } from '@holi/chat/src/store/types'

export const updateMessages = produce((thread: ChatMessage[], newMessage: ChatMessage) => {
  const dupMessage = thread.find((m) => m.id === newMessage.id)
  if (!dupMessage) {
    thread.push(newMessage)
    return
  }

  Object.assign(dupMessage, newMessage)
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
