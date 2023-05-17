import { HoliError } from '@holi/core/errors/classes/HoliError'

/** @description HoliError is Base class to inherit for all our custom errors */
export class HoliOnboardingError extends HoliError {
  constructor(message: string) {
    super(`[Onboarding] ${message}`)
  }
}
