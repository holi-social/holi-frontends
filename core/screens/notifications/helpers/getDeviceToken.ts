import * as Notifications from 'expo-notifications'

export const getDeviceToken = async (): Promise<string | null> =>
  Notifications.getDevicePushTokenAsync().then((token) => token.data)
