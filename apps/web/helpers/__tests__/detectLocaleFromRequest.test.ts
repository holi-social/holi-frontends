import type { NextApiRequest } from 'next'

import { detectLocaleFromRequest } from '@holi/web/helpers/detectLocaleFromRequest'

const createRequest = (acceptLanguage = '', locale?: string) =>
  ({
    headers: {
      'accept-language': acceptLanguage,
    },
    query: {
      locale,
    },
  }) as unknown as NextApiRequest

describe('detectLocaleFromRequest', () => {
  it('should use locale from query parameter', () => {
    const acceptLanguage = 'en-GB,en-US;q=0.9,en;q=0.8'
    const locale = detectLocaleFromRequest(createRequest(acceptLanguage, 'de'))
    expect(locale).toBe('de')
  })

  it('should fallback to accept language header if query parameter is missing', () => {
    const acceptLanguage = 'de,en-US;q=0.7,en;q=0.3'
    const locale = detectLocaleFromRequest(createRequest(acceptLanguage))
    expect(locale).toBe('de')
  })

  it('should fallback to accept language header if query parameter is invalid', () => {
    const acceptLanguage = 'de,en-US;q=0.7,en;q=0.3'
    const locale = detectLocaleFromRequest(createRequest(acceptLanguage, 'es'))
    expect(locale).toBe('de')
  })

  it('should use english as fallback if no header or paramter is provided', () => {
    const locale = detectLocaleFromRequest(createRequest())
    expect(locale).toBe('en')
  })
})
