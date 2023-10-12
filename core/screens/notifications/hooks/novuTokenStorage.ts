export const novuTokenStorage = {
  getItem: () => {
    // @ts-ignore:next-line
    return global.novuToken ?? null
  },
  removeItem: () => {
    // @ts-ignore:next-line
    delete global.novuToken
  },
  setItem: (_: string, value: string) => {
    // @ts-ignore:next-line
    global.novuToken = value
  },
}
