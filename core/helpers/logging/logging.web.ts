import { DEBUG_LOG_BY_DEFAULT, DEBUG_LOG_COMPONENTS } from '@holi/core/helpers/logging/logging_config'
import { Logger, NoopLoggerImpl } from '@holi/core/helpers/logging/types'

class WebLogger implements Logger {
  constructor(private component: string) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug(method: string, msg: string, ...args: any[]): void {
    console.debug(`${this.component} | ${method} | ${msg}`, ...args)
  }
}

export const getLogger = (component: string): Logger => {
  if (process.env.NODE_ENV === 'production') {
    return new NoopLoggerImpl()
  }
  if (component in DEBUG_LOG_COMPONENTS) {
    if (DEBUG_LOG_COMPONENTS[component as keyof typeof DEBUG_LOG_COMPONENTS]) {
      return new WebLogger(component)
    } else {
      return new NoopLoggerImpl()
    }
  } else if (DEBUG_LOG_BY_DEFAULT) {
    return new WebLogger(component)
  }
  return new NoopLoggerImpl()
}
