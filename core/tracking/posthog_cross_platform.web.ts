import { PostHog } from 'posthog-js'
import { usePostHog } from 'posthog-js/react'

import { PosthogCrossPlatform } from '@holi/core/tracking/types'

export class PosthogWeb implements PosthogCrossPlatform {
  constructor(private posthog: PostHog) {
    if (this.posthog === null || this.posthog === undefined) throw new Error('posthog instance is null or undefined')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  capture(event: string, properties: { [p: string]: any } | undefined): void {
    this.posthog.capture(event, properties)
  }

  identify(distinctId: string | undefined): void {
    this.posthog.identify(distinctId)
  }

  optIn(): Promise<void> {
    this.posthog.opt_in_capturing()
    return Promise.resolve()
  }

  optOut(): Promise<void> {
    this.posthog.opt_out_capturing()
    return Promise.resolve()
  }

  reset(): void {
    this.posthog.reset()
  }
}

export const usePosthogCrossPlatform = (): PosthogCrossPlatform => {
  return new PosthogWeb(usePostHog())
}
