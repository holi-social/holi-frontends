import { useQuery } from '@apollo/client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { isSSR } from '@holi/core/helpers/isSSR'
import { feedQuery } from '@holi/core/screens/homeFeed/queries'
import { goodNewsArticlesQuery } from '@holi-apps/goodnews/queries'
import { volunteeringRecosQuery } from '@holi-apps/volunteering/queries'
import { logError } from '@holi/core/errors/helpers'
import type { FeedItem } from '@holi/core/screens/homeFeed/types'
import { useVolunteeringRecosQueryVariables } from '@holi-apps/volunteering/hooks/useVolunteeringRecosQueryVariables'
import { feedInsightsQuery } from '@holi/core/screens/insights/queries'
import type { Insight } from '@holi/core/screens/insights/types'
import type { User } from '@holi/core/domain/shared/types'
import { useRandomizedRecos } from '@holi-apps/volunteering/hooks/useRandomizedRecos'

const PAGE_SIZE_EXTERNAL_DATA = 12
const PAGE_SIZE_FEED = 12
const POST_FREQUENCY = 2

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
    variables: {
      ...queryVariables,
      offset: 0,
      limit: PAGE_SIZE_EXTERNAL_DATA,
    },
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
  } = useQuery(feedInsightsQuery, {
    variables: { offset: 0, limit: PAGE_SIZE_EXTERNAL_DATA },
    onCompleted: (data) => {
      const creators = data.feedInsights.data
        .map((insight: Insight) => insight.creator)
        .filter((creator: User) => !!creator)
      setInsightsCreators(creators)
    },
  })

  useEffect(() => {
    if (!loading && !loadingInsights) {
      setInitialLoading(false)
    }
  }, [loading, loadingInsights])

  // Get the raw engagements data
  const engagements = useMemo(() => {
    return dataVolunteering?.appVolunteering_engagementRecosV2?.data || []
  }, [dataVolunteering?.appVolunteering_engagementRecosV2?.data])

  // Randomize the engagements
  const randomizedEngagements = useRandomizedRecos(engagements, engagements.length)

  const combinedFeedData = useMemo(() => {
    const feedData = data?.feed?.data || []
    const articles = dataGoodNews?.appGoodNews_articles?.articles || []
    const insights = dataInsights?.feedInsights?.data || []

    // Pre-calculate total length to avoid array resizing
    const totalExternalItems = Math.floor(feedData.length / POST_FREQUENCY) * 3
    const resultLength = feedData.length + totalExternalItems
    const result = new Array(resultLength)

    // Copy feed data first
    let resultIndex = 0
    feedData.forEach((item: FeedItem, i: number) => {
      result[resultIndex] = item
      resultIndex++

      // Insert external content every POST_FREQUENCY items
      if ((i + 1) % POST_FREQUENCY === 0) {
        const externalIndex = Math.floor(i / POST_FREQUENCY)

        // Insert good news
        if (articles[externalIndex]) {
          result[resultIndex] = { goodNewsArticle: articles[externalIndex] }
          resultIndex++
        }

        // Insert insight
        if (insights[externalIndex]) {
          result[resultIndex] = { insight: insights[externalIndex] }
          resultIndex++
        }

        // Insert volunteering - use randomizedEngagements
        if (randomizedEngagements[externalIndex]) {
          result[resultIndex] = {
            volunteeringReco: randomizedEngagements[externalIndex],
          }
          resultIndex++
        }
      }
    })

    // Remove any null entries and return
    return result.filter(Boolean)
  }, [
    data?.feed?.data,
    dataGoodNews?.appGoodNews_articles?.articles,
    dataInsights?.feedInsights?.data,
    randomizedEngagements,
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

          const existingIds = new Set(
            prev.feed.data.map((post: FeedItem) => post.feedPost?.id || post.spacePost?.id || post.insight?.id)
          )

          const newPosts = fetchMoreResult.feed.data.filter((newItem: FeedItem) => {
            const newId = newItem.feedPost?.id || newItem.spacePost?.id || newItem.insight?.id
            return !existingIds.has(newId)
          })

          return {
            feed: {
              ...prev.feed,
              data: [...prev.feed.data, ...newPosts],
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
      await Promise.all([refetch(), refetchGoodNews(), refetchVolunteering(), refetchInsights()])
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
