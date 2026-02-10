import type { NextApiRequest, NextApiResponse } from 'next'

const handler = (_req: NextApiRequest, res: NextApiResponse) => {
  const uptime = process.uptime()
  const maxUptime = parseInt(process.env.NEXT_PUBLIC_MAX_UPTIME_SEC)
  if (!isNaN(maxUptime) && uptime > maxUptime) {
    console.debug(`HEALTH - Max update was exceeded - Uptime: ${uptime}; Max: ${maxUptime}`)
    return res.status(500).json({ ok: false, msg: 'Max uptime exceeded' })
  }
  return res.status(200).json({ ok: true })
}

export default handler
