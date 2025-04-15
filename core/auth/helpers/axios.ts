// Based on https://github.com/ory/kratos-selfservice-ui-react-native/blob/a273225aa9f5b743a041eebc3c6cba173cc31d6d/src/helpers/axios.tsx
import { AxiosInstance } from 'axios'

import { HoliError } from '@holi/core/errors/classes/HoliError'
import { logError } from '@holi/core/errors/helpers'
import { getLogger } from '@holi/core/helpers/logging'

const logger = getLogger('CreateAccount')
const REQUEST_TIMEOUT_IN_MS = 10000
const RETRY_COUNT = 10

export const resilience = (axios: AxiosInstance) => {
  axios.defaults.timeout = REQUEST_TIMEOUT_IN_MS
  axios.interceptors.response.use(
    (v) => Promise.resolve(v),
    (error) => {
      if (!error.config) {
        logError(error, 'Received network error without axios details', { location: 'axios.resilience' })
        return Promise.reject(error)
      }

      if (
        error.response &&
        (error.response.status == 400 ||
          error.response.status == 401 ||
          error.response.status == 403 ||
          error.response.status == 422) // 422 is used by Ory for browser redirects
      ) {
        logger.debug('auth', 'network request failed with response code ' + error.response.status, {
          error,
        })
        return Promise.reject(error)
      }

      if (error.response && (error.response.status >= 400 || error.response.status < 500)) {
        // 4xx status means we should not retry.
        logError(error, `Network request failed: ${error.config}`, {
          location: 'axios.resilience',
          error: JSON.stringify(error, null, 2),
        })
        return Promise.reject(error)
      }

      const config = {
        ...error.config,
        timeout: REQUEST_TIMEOUT_IN_MS,
        count: (error?.config?.count || 0) + 1,
      }

      if (config.count > RETRY_COUNT) {
        const err = new HoliError(
          `Unable to reach network, gave up after ${RETRY_COUNT} retries. Please restart the app and try again.`
        )
        logError(err, `Reached max retry count: ${error.config}`, {
          location: 'axios.resilience',
          error: JSON.stringify(error, null, 2),
        })
        return Promise.reject(err)
      }

      logger.debug('auth', 'retrying due to network error', {
        count: error.config.count,
        error,
      })
      new Promise((resolve, reject) => {
        setTimeout(() => {
          axios.request(config).then(resolve).catch(reject)
        }, REQUEST_TIMEOUT_IN_MS)
      })
    }
  )
}
