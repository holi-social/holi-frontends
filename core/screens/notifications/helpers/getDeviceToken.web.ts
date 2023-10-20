export const getDeviceToken = async (): Promise<string | null> => Promise.resolve(null)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const registerDeviceTokenListener = (listener: (token: string) => void) => () => {
  // no-op
}
