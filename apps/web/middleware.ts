import { NextRequest, NextResponse } from 'next/server'

import { nextJsDefaultLocale, ni18nConfig } from '@holi/web/helpers/ni18nConfig'

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
  const detectedLocale = detectLocaleFromHeader(req.headers)
  if (detectedLocale !== ni18nConfig.fallbackLng) {
    return NextResponse.redirect(new URL(`/${detectedLocale}${pathname}${search}`, req.url))
  }
}
