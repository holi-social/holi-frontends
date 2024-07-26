import { PostHog } from 'posthog-node'

import { POSTHOG_BOOTSTRAP_PROP_NAME } from '@holi/web/types'

export const createPosthogPageProps = async () => {
  if (!process.env.POSTHOG_KEY) {
    return {}
  }

  const client = new PostHog(process.env.POSTHOG_KEY, { host: process.env.POSTHOG_HOST })

  const featureFlagsAndPayloads = await client.getAllFlagsAndPayloads('')

  return {
    [POSTHOG_BOOTSTRAP_PROP_NAME]: featureFlagsAndPayloads,
  }
}
