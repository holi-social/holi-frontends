import * as Notifications from 'expo-notifications'

export const getDeviceToken = async (): Promise<string | null> =>
  Notifications.getDevicePushTokenAsync().then((token) => token.data)

export const registerDeviceTokenListener = (listener: (token: string) => void) => {
  const subscription = Notifications.addPushTokenListener((token) => listener(token.data))
  return () => subscription.remove()
}
