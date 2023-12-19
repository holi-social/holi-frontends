import ChatClient from '@holi/chat/src/client/ChatClient'
import { HoliError } from '@holi/core/errors/classes/HoliError'

/** @description HoliError is Base class to inherit for all our custom errors */
export class HoliChatClientError extends HoliError {
  constructor(method: keyof ChatClient, message: string) {
    super(`[ChatClient.${String(method)}] ${message}`)
  }
}
