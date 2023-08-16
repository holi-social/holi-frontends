import { produce } from 'immer'
import { IRoomEvent } from 'matrix-js-sdk'

import type { ChatMessage, ChatMessageContent } from '@holi/chat/src/store/types'

export const updateMessages = produce((thread: ChatMessage[], newMessage: ChatMessage) => {
  const dupMessage = thread.find((m) => m.id === newMessage.id)
  if (!dupMessage) {
    thread.push(newMessage)
    return
  }

  Object.assign(dupMessage, newMessage)
})

export function createChatMessage(roomId: string, event: IRoomEvent): ChatMessage {
  // TODO: handle empty strings fallback
  return {
    id: event.event_id,
    content: event.content as ChatMessageContent,
    timestamp: event.origin_server_ts,
    room_id: roomId,
    sender: event.sender,
  }
}
