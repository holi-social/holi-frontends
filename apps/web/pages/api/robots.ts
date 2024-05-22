import type { NextApiRequest, NextApiResponse } from 'next'

// Make sure that we don't parse JSON bodies on this route:
export const config = {
  api: {
    bodyParser: false,
  },
}

const robotsTxtDevelopment = `User-agent: *
Disallow: /`

const robotsTxtProduction = `User-agent: *
Disallow: /profile/
Disallow: /*/profile/

Sitemap: https://app.holi.social/sitemap.xml`

const handler = (_req: NextApiRequest, res: NextApiResponse) => {
  const robotsTxt = process.env.NODE_ENV !== 'production' ? robotsTxtDevelopment : robotsTxtProduction

  res.setHeader('Content-Type', 'text/plain')
  res.write(robotsTxt)
  res.end()
}

export default handler
