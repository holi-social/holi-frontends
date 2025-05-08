import type { NextApiRequest, NextApiResponse } from 'next'

import { EnvironmentId } from '@holi/core/helpers/models/EnvironmentId'
import { environmentId } from '@holi/web/environment'
import { blockedBots } from '@holi/web/helpers/bots'

// Make sure that we don't parse JSON bodies on this route:
export const config = {
  api: {
    bodyParser: false,
  },
}

const robotsTxtDevelopment = `User-agent: *
Disallow: /`

const entryForBlockedBot = (userAgent: string) => `
User-agent: ${userAgent}
Disallow: /`

const robotsTxtProduction = `
${blockedBots.map(entryForBlockedBot).join('\n')}

User-agent: *

Sitemap: https://app.holi.social/sitemap.xml`

const handler = (_req: NextApiRequest, res: NextApiResponse) => {
  const robotsTxt = environmentId === EnvironmentId.PRODUCTION ? robotsTxtProduction : robotsTxtDevelopment

  res.setHeader('Content-Type', 'text/plain')
  res.write(robotsTxt)
  res.end()
}

export default handler
