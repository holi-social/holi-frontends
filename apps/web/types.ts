import type { Ni18nServerState } from 'ni18n'
import type { PostHogOptions } from 'posthog-node'

import type { SeoUrls } from '@holi/core/components/HoliHead/types'

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'
export const POSTHOG_BOOTSTRAP_PROP_NAME = '__POSTHOG_BOOTSTRAP__'

export interface CustomProps {
  seoTitle?: string
  urls?: SeoUrls
  blockIndexing?: boolean
}

interface ServerSideCustomProps {
  customProps: Partial<CustomProps>
  origin: string
}

export interface NextJSPageProps extends Ni18nServerState, ServerSideCustomProps, Record<string, unknown> {
  [APOLLO_STATE_PROP_NAME]?: Record<string, unknown>
  [POSTHOG_BOOTSTRAP_PROP_NAME]?: PostHogOptions['bootstrap']
}
