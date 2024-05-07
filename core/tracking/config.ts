import { posthogHost, posthogKey } from '@holi/core/helpers/config'
import { EnvironmentId } from '@holi/core/helpers/models/EnvironmentId'
import { environmentId } from '@holi/web/environment'

// exposed as function to be easily mock-able in testing
export const trackingEnabled = () =>
  environmentId !== EnvironmentId.PRODUCTION /* TODO HOLI-8252 eventually remove to enable for production */ &&
  [posthogKey, posthogHost].every((x) => x !== undefined && x.trim().length > 0)
