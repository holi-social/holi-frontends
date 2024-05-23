import type { IncomingMessage } from 'http'

import { getOrigin } from '@holi/web/helpers/getOrigin'

describe('getOrigin', () => {
  it('extracts origin from request headers', () => {
    const headers = {
      host: 'localhost:3000',
      'x-forwarded-proto': 'http',
    }
    const request = { url: '', headers } as unknown as IncomingMessage

    const origin = getOrigin(request)

    expect(origin).toEqual('http://localhost:3000')
  })

  it('it should use production url as fallback origin', async () => {
    const origin = getOrigin({} as IncomingMessage)

    expect(origin).toEqual('https://app.holi.social')
  })
})
