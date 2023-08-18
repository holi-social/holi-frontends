import * as Device from 'expo-device'
import { Platform } from 'react-native'

const IS_DEBUG_LOGGING_ENABLED = __DEV__

const IS_IN_TESTING_ENV = process.env.JEST_WORKER_ID !== undefined

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const logDebug = (method: string, msg: string, ...args: any[]) => {
  if (IS_DEBUG_LOGGING_ENABLED) {
    if (IS_IN_TESTING_ENV) {
      console.debug(`testing | ${method} | ${msg}`, ...args)
    } else if (Platform.OS === 'ios' || Platform.OS === 'android') {
      console.debug(`${Platform.OS} ${Device.brand} ${Device.modelName} | ${method} | ${msg}`, ...args)
    } else {
      console.debug(`${Platform.OS} | ${method} | ${msg}`, ...args)
    }
  }
}
