import type { NextPageContext } from 'next'
import { defaultLocale } from '@holi/core/i18n/locales.cjs'
import { generateSitemapUrlSet, getUrlPrefix } from '@holi/web/helpers/sitemap'
import { paths as donationPaths } from '@holi/web/pages/donations'
import { paths as volunteeringPaths } from '@holi/web/pages/volunteering'
import { ALL_TOPICS } from '@holi/core/domain/shared/types'

type Path = string | { [key: string]: string }

const static_urls: Path[] = [
  '/',
  '/spaces',
  donationPaths,
  volunteeringPaths,
  '/insights',
  '/insights/curationPrinciples',
  '/login',
  '/profile',
]

const createEntriesForPath = (locale: string, path: Path) =>
  typeof path === 'string' ? path : path[locale] || path[defaultLocale]

const createSpaceTopicFilterPath = (topic: string) => `/spaces/filter?topic=${topic}`

const createSitemapUrls = (locale: string = defaultLocale) => {
  return static_urls
    .map((path) => createEntriesForPath(locale, path))
    .concat(ALL_TOPICS.map((topic) => createEntriesForPath(locale, createSpaceTopicFilterPath(topic))))
}

const StaticSitemapIndex = () => {
  // Content is written to response in getServerSideProps
}

export const getServerSideProps = async ({ req, res, locale }: NextPageContext) => {
  const prefix = getUrlPrefix(req, locale)
  const sitemap = generateSitemapUrlSet(prefix, createSitemapUrls(locale))

  if (res) {
    res.setHeader('Content-Type', 'text/xml')
    res.write(sitemap)
    res.end()
  }

  return {
    props: {},
  }
}

export default StaticSitemapIndex
