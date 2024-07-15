import type { IncomingMessage } from 'http'

import { defaultLocale } from '@holi/core/i18n/locales.cjs'
import { getOrigin } from '@holi/web/helpers/getOrigin'

export const getUrlPrefix = (req?: IncomingMessage, locale: string = defaultLocale) => {
  const origin = getOrigin(req)
  return `${origin}/${locale}`
}

const createSitemapEntry = (prefix: string) => (url: string) =>
  `<sitemap>
    <loc>${prefix}${url}.xml</loc>
  </sitemap>
  `

export const generateSitemapIndex = (prefix: string, urls: string[]) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(createSitemapEntry(prefix)).join('')}</sitemapindex>
 `
}

const createUrlEntry = (prefix: string) => (url: string) =>
  `<url>
    <loc>${prefix}${url}</loc>
  </url>
  `

export const generateSitemapUrlSet = (prefix: string, urls: string[]) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(createUrlEntry(prefix)).join('')}</urlset>
`
}
