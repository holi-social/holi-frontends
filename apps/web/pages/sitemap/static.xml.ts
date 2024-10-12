import { gql } from '@apollo/client/core'
import type { NextPageContext } from 'next'
import pino from 'pino'

import { initializeWebApolloClient } from '@holi/api/graphql/client'
import { Topic } from '@holi/api/graphql/graphql-codegen'
import { defaultLocale } from '@holi/core/i18n/locales.cjs'
import { generateSitemapUrlSet, getUrlPrefix } from '@holi/web/helpers/sitemap'
import { paths as donationPaths } from '@holi/web/pages/donations'
import { paths as volunteeringPaths } from '@holi/web/pages/volunteering'

const logger = pino()

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

export const topicSlugsQuery = gql`
  query Topics {
    topics {
      data {
        slug
      }
    }
  }
`
const createEntriesForPath = (locale: string, path: Path) =>
  typeof path === 'string' ? path : path[locale] || path[defaultLocale]

const createSpaceTopicFilterPath = (topic: Topic) => `/spaces/filter?topic=${topic.slug}`

const createSitemapUrls = (locale: string = defaultLocale, topics: Topic[]) => {
  return static_urls
    .map((path) => createEntriesForPath(locale, path))
    .concat(topics.map((topic) => createEntriesForPath(locale, createSpaceTopicFilterPath(topic))))
}

const StaticSitemapIndex = () => {
  // Content is written to response in getServerSideProps
}

export const getServerSideProps = async ({ req, res, locale }: NextPageContext) => {
  const prefix = getUrlPrefix(req, locale)
  const client = initializeWebApolloClient()
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

  const sitemap = generateSitemapUrlSet(prefix, createSitemapUrls(locale, topics))

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
