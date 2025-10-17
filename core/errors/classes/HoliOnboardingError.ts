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
      'It looks like you configured ORY Kratos to not issue a session automatically after registration. This edge-case is currently not supported in this example app. You can find more information on enabling this feature here: https://www.ory.sh/kratos/docs/next/self-service/flows/user-registration#successful-registration'
    )
  }
}
