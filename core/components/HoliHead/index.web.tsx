import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import type { PropsWithChildren } from 'react'

import { HoliHeadProps, SeoUrls } from '@holi/core/components/HoliHead/types'
import { defaultLocale, locales } from '@holi/core/i18n/locales.cjs'

const MAX_LENGTH_OG_DESCRIPTION = 160
const LOCALE_X_DEFAULT = ''

const createLinkTags = ({
  requestLocale = defaultLocale,
  fullPath,
  origin,
  urls = {},
}: {
  requestLocale?: string
  fullPath: string
  origin?: string
  urls?: SeoUrls
}) => {
  if (!origin) {
    return []
  }

  const [fallbackUrl, queryString = ''] = fullPath.split('?')

  const alternates = locales.filter((locale) => locale != requestLocale)
  const allLocales = locales.concat([LOCALE_X_DEFAULT])

  const absoluteUrls = Object.fromEntries(
    allLocales.map((locale) => {
      const url = urls[locale] || urls[defaultLocale] || fallbackUrl
      const localePart = locale !== LOCALE_X_DEFAULT ? `/${locale}` : ''
      const queryPart = queryString ? `?${queryString}` : ''
      return [locale, `${origin}${localePart}${url}${queryPart}`]
    })
  )

  return [
    <link rel="canonical" href={absoluteUrls[requestLocale]} key="canonical" />,
    ...alternates.map((locale) => (
      <link rel="alternate" hrefLang={locale} href={absoluteUrls[locale]} key={`alternate-${locale}`} />
    )),
    <link rel="alternate" hrefLang="x-default" href={absoluteUrls[LOCALE_X_DEFAULT]} key="alternate-x-default" />,

    // OpenGraph
    <meta property="og:url" content={absoluteUrls[requestLocale]} key="ogUrl" />,
    <meta property="og:locale" content={requestLocale} key="ogLocale" />,
    ...alternates.map((locale) => (
      <meta property="og:locale:alternate" content={locale} key={`ogLocaleAlternate-${locale}`} />
    )),
  ]
}

const HoliHead = ({
  title,
  description,
  ogTitle,
  ogDescription,
  ogImage,
  urls,
  origin,
}: PropsWithChildren<HoliHeadProps>) => {
  const { locale: requestLocale, asPath } = useRouter()
  const linkTags = createLinkTags({ requestLocale, fullPath: asPath, origin, urls })
  return (
    <Head>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} key="description" />}

      {/* OpenGraph */}
      {ogTitle && <meta property="og:title" content={ogTitle} key="ogTitle" />}
      {ogDescription && (
        <meta
          property="og:description"
          content={ogDescription.substring(0, MAX_LENGTH_OG_DESCRIPTION)}
          key="ogDescription"
        />
      )}
      {ogImage && <meta property="og:image" content={ogImage} key="ogImage" />}

      {/* Links */}
      {linkTags}
    </Head>
  )
}

export default HoliHead
