// debug by default if component is not configured in DEBUG_LOG_COMPONENTS
export const DEBUG_LOG_BY_DEFAULT = true

// configure for which components debug logging is enabled
export const DEBUG_LOG_COMPONENTS = {
  AppInit: false,
  Auth: false,
  Chat: false,
  GoodNews: false,
  NavigationProvider: false,
  Notifications: false,
  Tracking: false,
  Other: false,
  RandomizationState: false,
}

export const IS_IN_TESTING_ENV = process.env.JEST_WORKER_ID !== undefined
