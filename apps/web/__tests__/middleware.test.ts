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
  acceptLangage,
}: {
  pathname: string
  locale?: string
  origin?: string
  href?: string
  search?: string
  acceptLangage?: string
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
      get: () => acceptLangage,
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
      acceptLangage: 'de',
    })

    const response = middleware(request)
    expect(response).toBeUndefined()
    expect(mockRedirect).not.toHaveBeenCalled()
  })

  it('should not redirect for api requests', () => {
    const request = createRequest({
      pathname: '/api/foobar',
      acceptLangage: 'de',
    })

    const response = middleware(request)
    expect(response).toBeUndefined()
    expect(mockRedirect).not.toHaveBeenCalled()
  })

  it('should not redirect for public files', () => {
    const request = createRequest({
      pathname: './foobar',
      acceptLangage: 'de',
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
      acceptLangage: 'en',
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
      acceptLangage: 'de',
    })

    const response = middleware(request)
    expect(response).toBeUndefined()
    expect(mockRedirect).not.toHaveBeenCalled()
  })

  it('should not redirect if path contains "default" as locale subpath and the detected locale is the default locale', () => {
    // Next.js does not distinguish between "/default/spaces" and "/spaces", i.e. forcing a redirect here would result in an endless loop
    const request = createRequest({
      href: origin + '/default/spaces',
      pathname: '/spaces',
      acceptLangage: 'en',
    })

    const response = middleware(request)
    expect(response).toBeUndefined()
    expect(mockRedirect).not.toHaveBeenCalled()
  })

  it('should redirect if path contains "default" as locale subpath and the detected locale differs from the default locale', () => {
    const request = createRequest({
      href: origin + '/default/spaces',
      pathname: '/spaces',
      acceptLangage: 'de',
    })

    const response = middleware(request)
    expect(response).toBeDefined()
    expect(mockRedirect).toHaveBeenCalledWith(new URL(origin + '/de/spaces'))
  })

  it('should not redirect if the detected locale is the default locale', () => {
    const request = createRequest({
      pathname: '/spaces',
      acceptLangage: 'en',
    })

    const response = middleware(request)
    expect(response).toBeUndefined()
    expect(mockRedirect).not.toHaveBeenCalled()
  })

  it('should redirect to the detected locale if it differs from the default locale', () => {
    const request = createRequest({
      pathname: '/spaces',
      acceptLangage: 'de',
    })

    const response = middleware(request)
    expect(response).toBeDefined()
    expect(mockRedirect).toHaveBeenCalledWith(new URL(origin + '/de/spaces'))
  })

  it('should keep search parameters when redirecting', () => {
    const request = createRequest({
      pathname: '/spaces/filter',
      search: '?topic=123',
      acceptLangage: 'de',
    })

    const response = middleware(request)
    expect(response).toBeDefined()
    expect(mockRedirect).toHaveBeenCalledWith(new URL(origin + '/de/spaces/filter?topic=123'))
  })
})
