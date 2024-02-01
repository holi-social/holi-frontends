import type { NextApiRequest } from 'next'

import { detectLocaleFromHeader } from '@holi/web/helpers/detectLocaleFromHeader'

const createRequest = (acceptLanguage = '') =>
  ({
    headers: {
      'accept-language': acceptLanguage,
    },
  } as NextApiRequest)

describe('detectLocaleFromHeader', () => {
  it('should detect english locale', () => {
    const acceptLanguage = 'en-GB,en-US;q=0.9,en;q=0.8'
    const locale = detectLocaleFromHeader(createRequest(acceptLanguage))
    expect(locale).toBe('en')
  })

  it('should detect german locale', () => {
    const acceptLanguage = 'de,en-US;q=0.7,en;q=0.3'
    const locale = detectLocaleFromHeader(createRequest(acceptLanguage))
    expect(locale).toBe('de')
  })

  it('should use german as fallback if languages are not supported', () => {
    const acceptLanguage = 'es-ES,cs-CZ,es,cs'
    const locale = detectLocaleFromHeader(createRequest(acceptLanguage))
    expect(locale).toBe('de')
  })

  it('should use german as fallback if no languages are provided', () => {
    const locale = detectLocaleFromHeader(createRequest())
    expect(locale).toBe('de')
  })

  it('should use german as fallback if no request is provided', () => {
    const locale = detectLocaleFromHeader()
    expect(locale).toBe('de')
  })
})
