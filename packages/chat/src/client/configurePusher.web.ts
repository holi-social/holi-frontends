import type { DevicePushToken } from 'expo-notifications'
import { MatrixClient } from 'matrix-js-sdk'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const configurePusher = async (mxClient: MatrixClient, token: DevicePushToken): Promise<void> =>
  Promise.resolve()
