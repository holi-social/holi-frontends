import { gql } from '@apollo/client/core'
import type { NextPageContext } from 'next'
import pino from 'pino'

import { initializeApolloSSRClient } from '@holi/api/graphql/client'
import { Topic } from '@holi/api/graphql/graphql-codegen'
import { defaultLocale, locales } from '@holi/core/i18n/locales.cjs'
import { getOrigin } from '@holi/web/helpers/getOrigin'
import { paths as donationPaths } from '@holi/web/pages/donations'
import { paths as volunteeringPaths } from '@holi/web/pages/volunteering'

const logger = pino()

type Path = string | { [key: string]: string }

const static_urls: Path[] = [
  '/',
  '/spaces',
  '/appsHub',
  donationPaths,
  volunteeringPaths,
  '/insights',
  '/insights/curationPrinciples',
  '/login',
  '/profile',
]

const topicSlugsQuery = gql`
  query Topics {
    topics {
      data {
        slug
      }
    }
  }
`

const createEntriesForPath = (origin: string, path: Path) => {
  return locales
    .map((locale) => {
      const localePath = typeof path === 'string' ? path : path[locale] || path[defaultLocale]
      return `<url>
        <loc>${origin}/${locale}${localePath}</loc>
      </url>`
    })
    .join('\n')
}

const createSpaceTopicFilterPath = (topic: Topic) => `/spaces/filter?topic=${topic.slug}`

const generateSiteMap = (origin: string, topics: Topic[]) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${static_urls.map((path) => createEntriesForPath(origin, path)).join('\n')}
    ${topics.map((topic) => createEntriesForPath(origin, createSpaceTopicFilterPath(topic))).join('\n')}
   </urlset>
 `
}

const SiteMap = () => {
  // Content is written to response in getServerSideProps
}

export const getServerSideProps = async ({ req, res }: NextPageContext) => {
  const origin = getOrigin(req)
  const client = initializeApolloSSRClient()
  const topics = await client
    .query({ query: topicSlugsQuery })
    .then((result) => result.data.topics.data)
    .catch((error) => {
      logger.error({
        message: 'Error retrieving topic slugs',
        error,
      })
      return []
    })

  const sitemap = generateSiteMap(origin, topics)

  if (res) {
    res.setHeader('Content-Type', 'text/xml')
    res.write(sitemap)
    res.end()
  }

  return {
    props: {},
  }
}

export default SiteMap
