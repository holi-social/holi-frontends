import { gql } from '@apollo/client'
import type { GetServerSidePropsContext } from 'next'
import pino from 'pino'

import { initializeWebApolloClient } from '@holi/api/graphql/client'
import { generateSitemapUrlSet, getUrlPrefix } from '@holi/web/helpers/sitemap'
import { PAGE_SIZE } from '@holi/web/pages/sitemap/insights.xml'
import type { LastInsightsResponse } from '@holi/core/screens/insights/queries'
import type { Insight } from '@holi/core/screens/insights/types'

const logger = pino()

export const insightsWithRelatedIdsQuery = gql`
  query LastInsights($offset: Int! = 0, $limit: Int! = 4) {
    lastInsights(offset: $offset, limit: $limit) {
      data {
        id
        posts {
          id
        }
        recommendations {
          id
        }
        quotes {
          id
        }
        initiatives {
          id
        }
        discussions {
          id
        }
      }
    }
  }
`

const createEntriesForInsight = (insight: Insight) => {
  const insightUrl = `/insights/${insight.id}`
  return [
    insightUrl,
    insight.posts.map((post) => `${insightUrl}/posts/${post.id}`),
    insight.recommendations?.map((recommendation) => `${insightUrl}/recommendations/${recommendation.id}`) ?? [],
    insight.quotes.map((quote) => `${insightUrl}/quotes/${quote.id}`),
    insight.initiatives?.map((initiative) => `${insightUrl}/initiatives/${initiative.id}`) ?? [],
    insight.discussions?.map((discussion) => `${insightUrl}/discussions/${discussion.id}`) ?? [],
  ].flat()
}

const asNum = (param: string | string[] | undefined) => {
  if (!param) {
    return 0
  }
  if (Array.isArray(param)) {
    return param.length ? Number.parseInt(param[0]) : 0
  }
  return Number.parseInt(param)
}

const InsightSiteMap = () => {
  // Content is written to response in getServerSideProps
}

export const getServerSideProps = async ({ req, res, query, locale }: GetServerSidePropsContext) => {
  const { page } = query
  const prefix = getUrlPrefix(req, locale)
  const client = initializeWebApolloClient({ locale })
  const insights = await client
    .query<LastInsightsResponse>({
      query: insightsWithRelatedIdsQuery,
      variables: { offset: asNum(page) * PAGE_SIZE, limit: PAGE_SIZE },
    })
    .then((result) => result.data?.lastInsights.data ?? [])
    .catch((error) => {
      logger.error({
        message: 'Error retrieving insights',
        error,
      })
      return [] as Insight[]
    })

  const sitemap = generateSitemapUrlSet(
    prefix,
    insights.flatMap((insight: Insight) => createEntriesForInsight(insight))
  )

  if (res) {
    res.setHeader('Content-Type', 'text/xml')
    res.write(sitemap)
    res.end()
  }

  return {
    props: {},
  }
}

export default InsightSiteMap
