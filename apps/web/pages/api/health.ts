import type { NextApiRequest, NextApiResponse } from 'next'

const handler = (_req: NextApiRequest, res: NextApiResponse) => {
  const uptime = process.uptime()
  const maxUptime = parseInt(process.env.NEXT_PUBLIC_MAX_UPTIME_SEC)
  console.log(`HEALTH - Uptime: ${uptime}; Max: ${maxUptime}`) // eslint-disable-line no-console
  if (!isNaN(maxUptime) && uptime > maxUptime) {
    return res.status(500).json({ ok: false })
  }
  return res.status(200).json({ ok: true })
}

export default handler
