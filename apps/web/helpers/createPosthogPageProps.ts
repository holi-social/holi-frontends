import { PostHog } from 'posthog-node'

export const createPosthogPageProps = async () => {
  if (!process.env.POSTHOG_KEY) {
    return undefined
  }

  const client = new PostHog(process.env.POSTHOG_KEY, { host: process.env.POSTHOG_HOST })

  // TODO HOLI-9368 this must use the distinct ID of the actual user
  const featureFlagsAndPayloads = await client.getAllFlagsAndPayloads('')

  return featureFlagsAndPayloads
}
