export interface Logger {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug: (method: string, msg: string, ...args: any[]) => void
}

export class NoopLoggerImpl implements Logger {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
  debug(method: string, msg: string, ...args: any[]): void {
    return undefined
  }
}
