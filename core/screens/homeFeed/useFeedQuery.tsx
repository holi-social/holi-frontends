import { useQuery } from '@apollo/client'
import { useCallback, useMemo, useState } from 'react'
import { isSSR } from '@holi/core/helpers/isSSR'
import { feedQuery } from '@holi/core/screens/homeFeed/queries'
import { goodNewsArticlesQuery } from '@holi-apps/goodnews/queries'
import { volunteeringRecosQuery } from '@holi-apps/volunteering/queries'
import { logError } from '@holi/core/errors/helpers'
import type { FeedItem } from '@holi/core/screens/homeFeed/types'
import type { GoodNewsArticle } from '@holi-apps/goodnews/types'
import type { VolunteeringReco } from '@holi-apps/volunteering/types'
import { useVolunteeringRecosQueryVariables } from '@holi-apps/volunteering/hooks/useVolunteeringRecosQueryVariables'

const PAGE_SIZE = 20
const VOLUNTEERING_FREQUENCY = 10 // every 10 items, one volunteering engagement
const GOOD_NEWS_FREQUENCY = 5 // every 5 items, one good news article

export const useFeedQuery = () => {
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  const { loading, fetchMore, refetch, data } = useQuery(feedQuery, {
    fetchPolicy: isSSR ? 'cache-first' : 'cache-and-network',
    variables: {
      limit: PAGE_SIZE,
      offset: 0,
    },
    onCompleted: () => setInitialLoading(false),
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
    variables: { ...queryVariables, offset: 0, limit: PAGE_SIZE },
    skip: loadingQueryVariables,
    onError: (error) =>
      logError(error, 'Failed to load volunteering recommendations', {
        location: 'useFeedQuery.volunteeringRecosQuery',
      }),
  })

  const combinedFeedData = useMemo(() => {
    const feedData = data?.feed?.data || []
    const combined: (FeedItem & {
      goodNewsArticle?: GoodNewsArticle
      volunteeringReco?: VolunteeringReco
    })[] = [...feedData]
    const articles = dataGoodNews?.appGoodNews_articles?.articles || []
    const engagements = dataVolunteering?.appVolunteering_engagementRecos?.data || []

    // Insert a good news article after every 5 feed items
    articles.forEach((article: GoodNewsArticle, index: number) => {
      const insertPosition = (index + 1) * GOOD_NEWS_FREQUENCY
      if (insertPosition < combined.length) {
        combined.splice(insertPosition, 0, { goodNewsArticle: article })
      }
    })

    // Insert volunteering engagement after every 10 feed items
    engagements.forEach((recommendation: VolunteeringReco, index: number) => {
      const insertPosition = (index + 1) * VOLUNTEERING_FREQUENCY
      if (insertPosition < combined.length) {
        combined.splice(insertPosition, 0, { volunteeringReco: recommendation })
      }
    })

    return combined
  }, [
    data?.feed?.data,
    dataGoodNews?.appGoodNews_articles?.articles,
    dataVolunteering?.appVolunteering_engagementRecos?.data,
  ])

  const handleFetchMore = useCallback(async () => {
    if (isLoadingMore) return
    setIsLoadingMore(true)

    try {
      await fetchMore({
        variables: {
          offset: data?.feed?.data?.length || 0,
          limit: PAGE_SIZE,
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
    } finally {
      setRefreshing(false)
    }
  }, [refetch, refetchGoodNews, refetchVolunteering])

  return {
    initialLoading,
    isLoading: loading || isLoadingMore,
    canLoadMore,
    combinedFeedData,
    fetchMore: handleFetchMore,
    refetch: handleRefresh,
    refreshing,
  }
}
