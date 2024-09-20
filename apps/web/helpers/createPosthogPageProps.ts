import { PostHog } from 'posthog-node'

export const createPosthogPageProps = async (userId?: string) => {
  if (!process.env.POSTHOG_KEY) {
    return undefined
  }

  const client = new PostHog(process.env.POSTHOG_KEY, { host: process.env.POSTHOG_HOST })

  const featureFlagsAndPayloads = await client.getAllFlagsAndPayloads(userId ?? '')

  return featureFlagsAndPayloads
}
