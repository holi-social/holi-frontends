import { NextRequest, NextResponse } from 'next/server'

import { nextJsDefaultLocale } from '@holi/web/helpers/middlewareConfig'

import { detectLocaleFromHeader } from './helpers/detectLocaleFromHeader'

const PUBLIC_FILE = /\.(.*)$/

// Inspired by https://nextjs.org/docs/pages/building-your-application/routing/internationalization#prefixing-the-default-locale
// But instead of always redirecting, we only redirect for locales that are not equal to the default locale
export function middleware(req: NextRequest) {
  const { pathname, search, locale } = req.nextUrl
  if (
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.includes('/api/') ||
    PUBLIC_FILE.test(req.nextUrl.pathname) ||
    locale !== nextJsDefaultLocale
  ) {
    return
  }
  // Redirect to locale detected in request headers if current locale is "default"
  const detectedLocale = detectLocaleFromHeader(req.headers)
  return NextResponse.redirect(new URL(`/${detectedLocale}${pathname}${search}`, req.url))
}
