import { type PostHog, usePostHog } from 'posthog-react-native'
import { useMemo } from 'react'

import type { PosthogCrossPlatform, Properties } from '@holi/core/tracking/types'

export class PosthogReactNative implements PosthogCrossPlatform {
  constructor(private posthog: PostHog) {
    if (this.posthog === null || this.posthog === undefined) throw new Error('posthog instance is null or undefined')
  }

  distinctId() {
    return this.posthog.getDistinctId()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  capture(event: string, properties: { [p: string]: any } | undefined): void {
    this.posthog.capture(event, properties)
  }

  identify(distinctId: string, properties?: Properties): void {
    this.posthog.identify(distinctId, properties)
  }

  updatePersonProperties(properties?: Properties | undefined): void {
    const prop = properties && { $set: properties }
    this.posthog.capture('$set', prop)
  }

  async flush(): Promise<void> {
    await this.posthog.flush()
  }

  optedIn(): boolean {
    return !this.posthog.optedOut
  }

  async optIn(): Promise<void> {
    if (this.posthog.optedOut) await this.posthog.optIn()
  }

  async optOut(): Promise<void> {
    if (!this.posthog.optedOut) await this.posthog.optOut()
  }

  reset(): void {
    this.posthog.reset()
  }
}

export const usePosthogCrossPlatform = (): PosthogCrossPlatform => {
  const posthog = usePostHog()
  return useMemo(() => new PosthogReactNative(posthog), [posthog])
}
