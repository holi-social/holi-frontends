import type { NextApiRequest, NextApiResponse } from 'next'

const versionInfo = {
  name: 'Holi Frontends Web',
  version: process.env.CI_COMMIT_REF_NAME,
  branch: process.env.CI_COMMIT_BRANCH,
  sha: process.env.CI_COMMIT_SHA,
  title: process.env.CI_COMMIT_TITLE,
}

const handler = (_req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Content-Type', 'application/json')
  res.write(JSON.stringify(versionInfo))
  res.end()
}

export default handler
