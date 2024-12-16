import { useQuery } from '@apollo/client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { isSSR } from '@holi/core/helpers/isSSR'
import { feedQuery } from '@holi/core/screens/homeFeed/queries'
import { goodNewsArticlesQuery } from '@holi-apps/goodnews/queries'
import { volunteeringRecosQuery } from '@holi-apps/volunteering/queries'
import { logError } from '@holi/core/errors/helpers'
import type { FeedItem } from '@holi/core/screens/homeFeed/types'
import type { GoodNewsArticle } from '@holi-apps/goodnews/types'
import type { VolunteeringReco } from '@holi-apps/volunteering/types'
import { useVolunteeringRecosQueryVariables } from '@holi-apps/volunteering/hooks/useVolunteeringRecosQueryVariables'
import { lastInsightsQuery } from '@holi/core/screens/insights/queries'
import type { Insight } from '@holi/core/screens/insights/types'
import type { User } from '@holi/core/domain/shared/types'

const PAGE_SIZE_EXTERNAL_DATA = 10
const PAGE_SIZE_FEED = 20
const VOLUNTEERING_FREQUENCY = 10 // every X items, one volunteering engagement
const GOOD_NEWS_FREQUENCY = 8 // every X items, one good news article
const INSIGHTS_FREQUENCY = 5 // every X items, one insight

export const useFeedQuery = () => {
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [insightsCreators, setInsightsCreators] = useState<User[]>([])

  const { loading, fetchMore, refetch, data } = useQuery(feedQuery, {
    fetchPolicy: isSSR ? 'cache-first' : 'cache-and-network',
    variables: {
      limit: PAGE_SIZE_FEED,
      offset: 0,
    },
  })

  const { data: dataGoodNews, refetch: refetchGoodNews } = useQuery(goodNewsArticlesQuery, {
    variables: {
      lastDate: undefined,
    },
    onError: (error) =>
      logError(error, 'Failed to load good news articles', {
        location: 'useFeedQuery.GoodNewsArticlesQuery',
      }),
  })

  const { queryVariables, loading: loadingQueryVariables } = useVolunteeringRecosQueryVariables()

  const { data: dataVolunteering, refetch: refetchVolunteering } = useQuery(volunteeringRecosQuery, {
    variables: { ...queryVariables, offset: 0, limit: PAGE_SIZE_EXTERNAL_DATA },
    skip: loadingQueryVariables,
    onError: (error) =>
      logError(error, 'Failed to load volunteering recommendations', {
        location: 'useFeedQuery.volunteeringRecosQuery',
      }),
  })

  const {
    data: dataInsights,
    loading: loadingInsights,
    refetch: refetchInsights,
  } = useQuery(lastInsightsQuery, {
    variables: { offset: 0, limit: PAGE_SIZE_EXTERNAL_DATA },
    onCompleted: (data) => {
      setInsightsCreators(
        data.lastInsights.data.map((insight: Insight) => insight.creator).filter((creator: User) => !!creator)
      )
    },
  })

  useEffect(() => {
    if (!loading && !loadingInsights) {
      setInitialLoading(false)
    }
  }, [loading, loadingInsights])

  const combinedFeedData = useMemo(() => {
    const feedData = data?.feed?.data || []
    const combined: (FeedItem & {
      goodNewsArticle?: GoodNewsArticle
      volunteeringReco?: VolunteeringReco
    })[] = [...feedData]
    const articles = dataGoodNews?.appGoodNews_articles?.articles || []
    const engagements = dataVolunteering?.appVolunteering_engagementRecos?.data || []
    const insights = dataInsights?.lastInsights?.data || []

    // Insert a good news article after every GOOD_NEWS_FREQUENCY feed items
    articles.forEach((article: GoodNewsArticle, index: number) => {
      const insertPosition = (index + 1) * GOOD_NEWS_FREQUENCY
      if (insertPosition < combined.length) {
        combined.splice(insertPosition, 0, { goodNewsArticle: article })
      }
    })

    // Insert volunteering engagement after every VOLUNTEERING_FREQUENCY feed items
    engagements.forEach((recommendation: VolunteeringReco, index: number) => {
      const insertPosition = (index + 1) * VOLUNTEERING_FREQUENCY
      if (insertPosition < combined.length) {
        combined.splice(insertPosition, 0, { volunteeringReco: recommendation })
      }
    })

    // Insert insights after every INSIGHTS_FREQUENCY feed items
    insights.forEach((insight: Insight, index: number) => {
      const insertPosition = (index + 1) * INSIGHTS_FREQUENCY
      if (insertPosition < combined.length) {
        combined.splice(insertPosition, 0, { insight })
      }
    })

    return combined
  }, [
    data?.feed?.data,
    dataGoodNews?.appGoodNews_articles?.articles,
    dataVolunteering?.appVolunteering_engagementRecos?.data,
    dataInsights?.lastInsights?.data,
  ])

  const handleFetchMore = useCallback(async () => {
    if (isLoadingMore) return
    setIsLoadingMore(true)

    try {
      await fetchMore({
        variables: {
          offset: data?.feed?.data?.length || 0,
          limit: PAGE_SIZE_EXTERNAL_DATA,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult?.feed?.data) return prev
          return {
            feed: {
              ...prev.feed,
              data: [
                ...prev.feed.data,
                ...fetchMoreResult.feed.data.filter(
                  (newItem: FeedItem) =>
                    !prev.feed.data.some(
                      (existingPost: FeedItem) =>
                        (newItem.feedPost?.id && existingPost.feedPost?.id === newItem.feedPost.id) ||
                        (newItem.spacePost?.id && existingPost.spacePost?.id === newItem.spacePost.id) ||
                        (newItem.insight?.id && existingPost.insight?.id === newItem.insight.id)
                    )
                ),
              ],
            },
          }
        },
      })
    } finally {
      setIsLoadingMore(false)
    }
  }, [isLoadingMore, fetchMore, data?.feed?.data?.length])

  const canLoadMore = !loading && data?.feed?.data?.length < (data?.feed?.totalResults || 0)

  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    try {
      await refetch()
      await refetchGoodNews()
      await refetchVolunteering()
      await refetchInsights()
    } finally {
      setRefreshing(false)
    }
  }, [refetch, refetchGoodNews, refetchVolunteering, refetchInsights])

  return {
    initialLoading,
    isLoading: loading || isLoadingMore,
    canLoadMore,
    combinedFeedData,
    fetchMore: handleFetchMore,
    refetch: handleRefresh,
    refreshing,
    insightsCreators,
  }
}
