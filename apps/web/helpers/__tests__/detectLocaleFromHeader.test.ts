import type { NextRequest } from 'next/server'

import { detectLocaleFromHeader } from '@holi/web/helpers/detectLocaleFromHeader'

const createApiHeaders = (acceptLanguage = '') => ({
  'accept-language': acceptLanguage,
})

const createHeaders = (acceptLanguage = '') =>
  ({
    get: () => acceptLanguage,
  }) as unknown as NextRequest['headers']

describe('detectLocaleFromHeader', () => {
  describe('api request', () => {
    it('should detect english locale', () => {
      const acceptLanguage = 'en-GB,en-US;q=0.9,en;q=0.8'
      const locale = detectLocaleFromHeader(createApiHeaders(acceptLanguage))
      expect(locale).toBe('en')
    })

    it('should detect german locale', () => {
      const acceptLanguage = 'de,en-US;q=0.7,en;q=0.3'
      const locale = detectLocaleFromHeader(createApiHeaders(acceptLanguage))
      expect(locale).toBe('de')
    })

    it('should use english as fallback if languages are not supported', () => {
      const acceptLanguage = 'es-ES,cs-CZ,es,cs'
      const locale = detectLocaleFromHeader(createApiHeaders(acceptLanguage))
      expect(locale).toBe('en')
    })

    it('should use english as fallback if no languages are provided', () => {
      const locale = detectLocaleFromHeader(createApiHeaders())
      expect(locale).toBe('en')
    })
  })

  describe('server request', () => {
    it('should detect english locale', () => {
      const acceptLanguage = 'en-GB,en-US;q=0.9,en;q=0.8'
      const locale = detectLocaleFromHeader(createHeaders(acceptLanguage))
      expect(locale).toBe('en')
    })

    it('should detect german locale', () => {
      const acceptLanguage = 'de,en-US;q=0.7,en;q=0.3'
      const locale = detectLocaleFromHeader(createHeaders(acceptLanguage))
      expect(locale).toBe('de')
    })

    it('should use english as fallback if languages are not supported', () => {
      const acceptLanguage = 'es-ES,cs-CZ,es,cs'
      const locale = detectLocaleFromHeader(createHeaders(acceptLanguage))
      expect(locale).toBe('en')
    })

    it('should use english as fallback if no languages are provided', () => {
      const locale = detectLocaleFromHeader(createHeaders())
      expect(locale).toBe('en')
    })
  })

  it('should use english as fallback if no request is provided', () => {
    const locale = detectLocaleFromHeader()
    expect(locale).toBe('en')
  })
})
