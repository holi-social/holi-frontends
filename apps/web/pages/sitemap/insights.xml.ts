import { gql } from '@apollo/client'
import type { GetServerSidePropsContext } from 'next'
import pino from 'pino'

import { initializeWebApolloClient } from '@holi/api/graphql/client'
import { generateSitemapIndex, getUrlPrefix } from '@holi/web/helpers/sitemap'

const logger = pino()

// Sitemaps may not contain more than 50k entries
// Assuming each insight won't contain more than 100 links
export const PAGE_SIZE = 500

export const insightsCountQuery = gql`
  query LastInsights {
    lastInsights {
      totalResults
    }
  }
`

const createInsightSitemapUrls = (totalInsightsCount: number) => {
  const sitemapCount = totalInsightsCount ? Math.ceil(totalInsightsCount / PAGE_SIZE) : 0
  const sitemapBaseUrl = '/sitemap/insights/'
  return Array.from({ length: sitemapCount }, (_, index) => `${sitemapBaseUrl}${index}`)
}

const InsightsSiteMapIndex = () => {
  // Content is written to response in getServerSideProps
}

export const getServerSideProps = async ({ req, res, locale }: GetServerSidePropsContext) => {
  const prefix = getUrlPrefix(req, locale)
  const client = initializeWebApolloClient({ locale })
  const totalInsightsCount = await client
    .query({ query: insightsCountQuery })
    .then((result) => result.data.lastInsights.totalResults)
    .catch((error) => {
      logger.error({
        message: 'Error retrieving insights count',
        error,
      })
      return 0
    })

  const sitemap = generateSitemapIndex(prefix, createInsightSitemapUrls(totalInsightsCount))

  if (res) {
    res.setHeader('Content-Type', 'text/xml')
    res.write(sitemap)
    res.end()
  }

  return {
    props: {},
  }
}

export default InsightsSiteMapIndex
