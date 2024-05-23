import type { IncomingMessage } from 'http'

export const getOrigin = (req?: IncomingMessage) => {
  const headers = req?.headers || {}
  const protocol = headers['x-forwarded-proto'] || 'https'
  const host = headers['host'] || 'app.holi.social'
  return `${protocol}://${host}`
}
