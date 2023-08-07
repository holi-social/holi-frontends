import * as Device from 'expo-device'

const IS_DEBUG_LOGGING_ENABLED = __DEV__

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const logDebug = (method: string, msg: string, ...args: any[]) => {
  if (IS_DEBUG_LOGGING_ENABLED) {
    if (Device.isDevice) {
      console.debug(`${Device.osName} | ${Device.brand} ${Device.modelName} | ${method} | ${msg}`, ...args)
    } else {
      console.debug(`${Device.osName} | ${method} | ${msg}`, ...args)
    }
  }
}
