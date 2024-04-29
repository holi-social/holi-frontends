import { posthogHost, posthogKey } from '@holi/core/helpers/config'

// exposed as function to be easily mock-able in testing
export const trackingEnabled = () => [posthogKey, posthogHost].every((x) => x !== undefined && x.trim().length > 0)
