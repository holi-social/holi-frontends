import type { PostHog } from 'posthog-js'
import { usePostHog } from 'posthog-js/react'
import { useMemo } from 'react'

import type { PosthogCrossPlatform, Properties } from '@holi/core/tracking/types'

export class PosthogWeb implements PosthogCrossPlatform {
  constructor(private posthog: PostHog) {
    if (this.posthog === null || this.posthog === undefined) throw new Error('posthog instance is null or undefined')
  }

  distinctId() {
    return this.posthog.get_distinct_id()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  capture(event: string, properties: { [p: string]: any } | undefined): void {
    this.posthog.capture(event, properties)
  }

  identify(distinctId: string, properties?: Properties): void {
    this.posthog.identify(distinctId, properties)
  }

  updatePersonProperties(properties?: Properties | undefined): void {
    this.posthog.capture('$set', { $set: properties })
  }

  async flush(): Promise<void> {
    // flush is not available for Web :/
    return Promise.resolve()
  }

  optedIn(): boolean {
    return this.posthog.has_opted_in_capturing()
  }

  optIn(): Promise<void> {
    if (!this.posthog.has_opted_in_capturing()) {
      this.posthog.opt_in_capturing()
    }
    return Promise.resolve()
  }

  optOut(): Promise<void> {
    if (!this.posthog.has_opted_out_capturing()) {
      this.posthog.opt_out_capturing()
    }
    return Promise.resolve()
  }

  reset(): void {
    this.posthog.reset()
  }

  async reloadFeatureFlags(): Promise<void> {
    this.posthog.featureFlags.reloadFeatureFlags()
  }
}

export const usePosthogCrossPlatform = (): PosthogCrossPlatform => {
  const posthog = usePostHog()
  return useMemo(() => new PosthogWeb(posthog), [posthog])
}
