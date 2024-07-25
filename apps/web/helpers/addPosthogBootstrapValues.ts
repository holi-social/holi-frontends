import { PostHog } from 'posthog-node'

import { type NextJSPageProps, POSTHOG_BOOTSTRAP_PROP_NAME } from '@holi/web/types'

export const addPosthogBootstrapValues = async (props: Partial<NextJSPageProps>) => {
  // TODO(SF) ensure env var is set
  if (!process.env.POSTHOG_KEY) {
    return props
  }

  const client = new PostHog(process.env.POSTHOG_KEY, { host: process.env.POSTHOG_HOST })

  const featureFlagsAndPayloads = await client.getAllFlagsAndPayloads('')

  return {
    ...props,
    [POSTHOG_BOOTSTRAP_PROP_NAME]: featureFlagsAndPayloads,
  }
}
