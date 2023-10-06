// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const logDebug = (method: string, msg: string, ...args: any[]) => {
  if (process.env.NODE_ENV !== 'production') {
    console.debug(`${method} | ${msg}`, ...args)
  }
}
