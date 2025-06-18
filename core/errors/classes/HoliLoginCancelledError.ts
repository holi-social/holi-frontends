import { HoliError } from '@holi/core/errors/classes/HoliError'

/** @description HoliError is Base class to inherit for all our custom errors */
export class HoliLoginCancelledError extends HoliError {
  constructor(message: string) {
    super(`[Auth] ${message}`)
    this.name = 'HoliLoginCancelledError'
  }
}
