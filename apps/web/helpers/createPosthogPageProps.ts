import { PostHog } from 'posthog-node'

export const createPosthogPageProps = async (userId?: string) => {
  if (!process.env.POSTHOG_KEY) {
    return undefined
  }

  const client = new PostHog(process.env.POSTHOG_KEY, { host: process.env.POSTHOG_HOST })

  const featureFlagsAndPayloads = await client.getAllFlagsAndPayloads(userId ?? '')

  // JSON transform as workaround for issue "`undefined` cannot be serialized as JSON. Please use `null` or omit this value all together."
  // see open NextJS issue: https://github.com/vercel/next.js/discussions/11209
  return JSON.parse(JSON.stringify(featureFlagsAndPayloads))
}
