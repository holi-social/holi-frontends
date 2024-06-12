import type { NextRequest } from 'next/server'

import { nextJsDefaultLocale } from '@holi/web/helpers/ni18nConfig'
import { middleware } from '@holi/web/middleware'

const mockRedirect = jest.fn()
jest.mock('next/server', () => ({
  NextResponse: {
    redirect: (url: URL) => mockRedirect(url),
  },
}))

const origin = 'https://app.holi.social'
const createRequest = ({
  pathname,
  href,
  locale = nextJsDefaultLocale,
  search = '',
  acceptLanguage,
}: {
  pathname: string
  locale?: string
  origin?: string
  href?: string
  search?: string
  acceptLanguage?: string
}): NextRequest => {
  const url = href || origin + pathname + (search || '')
  return {
    nextUrl: {
      pathname,
      origin,
      href: url,
      search,
      locale,
    },
    headers: {
      get: () => acceptLanguage,
    },
    url,
  } as NextRequest
}

describe('middleware', () => {
  beforeEach(() => {
    mockRedirect.mockReturnValue({})
  })

  it('should not redirect for _next requests', () => {
    const request = createRequest({
      pathname: '/_next/foobar',
      acceptLanguage: 'de',
    })

    const response = middleware(request)
    expect(response).toBeUndefined()
    expect(mockRedirect).not.toHaveBeenCalled()
  })

  it('should not redirect for api requests', () => {
    const request = createRequest({
      pathname: '/api/foobar',
      acceptLanguage: 'de',
    })

    const response = middleware(request)
    expect(response).toBeUndefined()
    expect(mockRedirect).not.toHaveBeenCalled()
  })

  it('should not redirect for public files', () => {
    const request = createRequest({
      pathname: './foobar',
      acceptLanguage: 'de',
    })

    const response = middleware(request)
    expect(response).toBeUndefined()
    expect(mockRedirect).not.toHaveBeenCalled()
  })

  it('should not redirect if path contains a valid locale subpath', () => {
    const request = createRequest({
      href: origin + '/de/spaces',
      pathname: '/spaces',
      locale: 'de',
      acceptLanguage: 'en',
    })

    const response = middleware(request)
    expect(response).toBeUndefined()
    expect(mockRedirect).not.toHaveBeenCalled()
  })

  it('should not redirect if path contains the default locale as subpath', () => {
    const request = createRequest({
      href: origin + '/en/spaces',
      pathname: '/spaces',
      locale: 'en',
      acceptLanguage: 'de',
    })

    const response = middleware(request)
    expect(response).toBeUndefined()
    expect(mockRedirect).not.toHaveBeenCalled()
  })

  it('should redirect if path contains "default" as locale subpath', () => {
    const request = createRequest({
      href: origin + '/default/spaces',
      pathname: '/spaces',
      acceptLanguage: 'de',
    })

    const response = middleware(request)
    expect(response).toBeDefined()
    expect(mockRedirect).toHaveBeenCalledWith(new URL(origin + '/de/spaces'))
  })

  it('should redirect to the detected locale if no locale subpath is present', () => {
    const request = createRequest({
      pathname: '/spaces',
      acceptLanguage: 'de',
    })

    const response = middleware(request)
    expect(response).toBeDefined()
    expect(mockRedirect).toHaveBeenCalledWith(new URL(origin + '/de/spaces'))
  })

  it('should keep search parameters when redirecting', () => {
    const request = createRequest({
      pathname: '/spaces/filter',
      search: '?topic=123',
      acceptLanguage: 'de',
    })

    const response = middleware(request)
    expect(response).toBeDefined()
    expect(mockRedirect).toHaveBeenCalledWith(new URL(origin + '/de/spaces/filter?topic=123'))
  })
})
