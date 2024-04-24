import { posthogHost, posthogKey } from '@holi/core/helpers/config'

export const trackingEnabled = [posthogKey, posthogHost].every((x) => x !== undefined && x.trim().length > 0)
