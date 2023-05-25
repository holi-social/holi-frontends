/* eslint-disable @typescript-eslint/no-var-requires */

// Code based on https://jake.tl/notes/2021-04-04-nextjs-preload-hack

/**
 * Set up logging. Monkey patches a bunch of stuff.
 */
const setUpLogging = () => {
  // pino is a simple JSON logger with Datadog integration.
  // By default it logs to STDOUT.
  const pino = require('pino')

  // https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#logseverity
  const PinoLevelToSeverityLookup = {
    trace: 'DEBUG',
    debug: 'DEBUG',
    info: 'INFO',
    warn: 'WARNING',
    error: 'ERROR',
    fatal: 'CRITICAL',
  }

  const logger = pino({
    formatters: {
      level(level, number) {
        return {
          severity: PinoLevelToSeverityLookup[level] || PinoLevelToSeverityLookup['info'],
          level: number,
        }
      },
      log(entry) {
        const error = entry.err
        return { ...entry, ...(error instanceof Error && { stack_trace: error.stack }) }
      },
    },
    mixin() {
      return {
        'logging.googleapis.com/labels': {
          environment: process.env.ENVIRONMENT_ID || process.env.NEXT_PUBLIC_ENVIRONMENT_ID || 'development',
          service: 'holi-frontends-web',
        },
      }
    },
    messageKey: 'message',
    level: 'info',
  })

  function getLoggingFunction(/** @type {string} */ levelName) {
    const baseLogFn = (logger[levelName] || logger.info).bind(logger)
    return function patchedLog(/** @type {any[]} */ ...parts) {
      /** @type {object | undefined} */
      let data = undefined
      /** @type {object | undefined} */
      let error = undefined

      /** @type {object | undefined} */
      const nativeError = parts.find(
        (it) => (it && it instanceof Error) || (it && typeof it === 'object' && 'name' in it && 'message' in it)
      )

      if (nativeError) {
        error = cleanObjectForSerialization(nativeError)
        // If you use Sentry, Rollbar, etc, you could capture the error here.
        // ErrorThingy.report(nativeError)
      }

      // If next is trying to log funky stuff, put it into the data object.
      if (parts.length > 1) {
        data = data || {}
        data.parts = parts.map((part) => cleanObjectForSerialization(part))
      }

      const messages = nativeError && parts.length === 1 ? [nativeError.toString()] : parts

      baseLogFn({ data, error, type: levelName }, ...messages)
    }
  }

  // Monkey-patch Next.js logger.
  // See https://github.com/atkinchris/next-logger/blob/main/index.js
  // See https://github.com/vercel/next.js/blob/canary/packages/next/build/output/log.ts
  const nextBuiltInLogger = require('next/dist/build/output/log')
  for (const [property, value] of Object.entries(nextBuiltInLogger)) {
    if (typeof value !== 'function') {
      continue
    }

    nextBuiltInLogger[property] = getLoggingFunction(property)
  }

  /**
   * Monkey-patch global console.log logger. Yes. Sigh.
   * @type {Array<keyof typeof console>}
   */
  const loggingProperties = ['log', 'debug', 'info', 'warn', 'error']
  for (const property of loggingProperties) {
    // eslint-disable-next-line no-console
    console[property] = getLoggingFunction(property)
  }

  // Add general error logging.
  process.on('unhandledRejection', (error, promise) => {
    logger.error(
      {
        type: 'unhandledRejection',
        error: cleanObjectForSerialization(error),
        data: { promise: cleanObjectForSerialization(promise) },
      },
      `${error}`
    )
  })

  process.on('uncaughtException', (error) => {
    logger.error({ type: 'uncaughtException', error: cleanObjectForSerialization(error) }, `${error}`)
  })

  logger.info('Logging initialized')
}

function decycle(obj, stack = []) {
  if (!obj || typeof obj !== 'object') {
    return obj
  }

  if (stack.includes(obj)) {
    return null
  }

  let s = stack.concat([obj])

  return Array.isArray(obj)
    ? obj.map((x) => decycle(x, s))
    : Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, decycle(v, s)]))
}

function cleanObjectForSerialization(value) {
  // Clean up or copy `value` so our logger or error reporting system
  // can record it.
  //
  // Because our logger `pino` uses JSON.stringify, we need to do
  // the following here:
  //
  // 1. Remove all cycles. JSON.stringify throws an error when you pass
  //    a value with cyclical references.
  //    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value
  // 2. Because JSON.stringify only serializes enumerable properties, we
  //    need to copy interesting, but non-enumerable properties like
  //    value.name and value.message for errors:
  //    JSON.stringify(new Error('nothing serialized')) returns '{}'
  //
  return decycle(value)
}

setUpLogging()
