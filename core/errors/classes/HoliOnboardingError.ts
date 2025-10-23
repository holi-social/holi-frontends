import { HoliError } from '@holi/core/errors/classes/HoliError'

/** @description HoliError is Base class to inherit for all our custom errors */
export class HoliOnboardingError extends HoliError {
  constructor(message: string) {
    super(`[Onboarding] ${message}`)
  }
}

/**
 * Kratos can be configured in such a way that it requires a login after
 * registration. You could handle that case by navigating to the Login screen
 * but for simplicity we'll just print an error.
 */
export class HoliOryRegistrationConfigError extends HoliOnboardingError {
  constructor() {
    super(
      'It looks like ORY Kratos is not configured to issue a session automatically after registration. You can find more information on enabling this feature here: https://www.ory.sh/kratos/docs/next/self-service/flows/user-registration#successful-registration'
    )
  }
}
