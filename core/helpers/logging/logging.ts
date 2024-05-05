import * as Device from 'expo-device'
import { Platform } from 'react-native'

import { DEBUG_LOG_BY_DEFAULT, DEBUG_LOG_COMPONENTS, IS_IN_TESTING_ENV } from '@holi/core/helpers/logging/constants'
import { Logger, NoopLoggerImpl } from '@holi/core/helpers/logging/types'

// global switch if debug logging should be on
export const IS_DEBUG_LOGGING_ENABLED = __DEV__

class NativeLoggerImpl implements Logger {
  constructor(private component: string) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug(method: string, msg: string, ...args: any[]): void {
    if (IS_DEBUG_LOGGING_ENABLED) {
      if (IS_IN_TESTING_ENV) {
        console.debug(`testing | ${this.component} | ${method} | ${msg}`, ...args)
      } else if (Platform.OS === 'ios' || Platform.OS === 'android') {
        console.debug(
          `${Platform.OS} ${Device.brand} ${Device.modelName} | ${this.component} | ${method} | ${msg}`,
          ...args
        )
      } else {
        console.debug(`${Platform.OS} | ${this.component} | ${method} | ${msg}`, ...args)
      }
    }
  }
}

export const getLogger = (component: string): Logger => {
  if (component in DEBUG_LOG_COMPONENTS) {
    if (DEBUG_LOG_COMPONENTS[component as keyof typeof DEBUG_LOG_COMPONENTS]) {
      return new NativeLoggerImpl(component)
    } else {
      return new NoopLoggerImpl()
    }
  } else if (DEBUG_LOG_BY_DEFAULT) {
    return new NativeLoggerImpl(component)
  }
  return new NoopLoggerImpl()
}
