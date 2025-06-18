import { useQuery } from '@apollo/client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { isSSR } from '@holi/core/helpers/isSSR'
import { feedQuery } from '@holi/core/screens/homeFeed/queries'
import { goodNewsArticlesQuery } from '@holi-apps/goodnews/queries'
import { logError } from '@holi/core/errors/helpers'
import type { CombinedFeedItem, FeedItem } from '@holi/core/screens/homeFeed/types'
import { feedInsightsQuery } from '@holi/core/screens/insights/queries'
import type { Insight } from '@holi/core/screens/insights/types'
import type { User } from '@holi/core/domain/shared/types'
import { useRandomizedVolunteeringRecos } from '@holi-apps/volunteering/hooks/useRandomizedVolunteeringRecos'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import type { FeedPost } from '@holi/core/screens/individualPosts/types'

const PAGE_SIZE_EXTERNAL_DATA = 12
const PAGE_SIZE_FEED = 12
const POST_FREQUENCY = 2

export const useFeedQuery = () => {
  const [isLoadingMore, setIsLoadingMore] = useState(false)
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

  // Get randomized engagements
  const randomizedEngagements = useRandomizedVolunteeringRecos({ pageSize: PAGE_SIZE_EXTERNAL_DATA })

  const combinedFeedData = useMemo<CombinedFeedItem[]>(() => {
    // TODO(SF) temp. filtering youtube post
    const feedData: FeedItem[] =
      data?.feed?.data?.filter(
        (item: FeedItem) =>
          !['test-yt-2-0b90adf7', 'testing-yt-81a1a6cc'].includes((item.feedPost as FeedPost)?.slug ?? '')
      ) || []
    const articles = dataGoodNews?.appGoodNews_articles?.articles || []
    const insights = dataInsights?.feedInsights?.data || []

    // Pre-calculate total length to avoid array resizing
    const totalExternalItems = Math.floor(feedData.length / POST_FREQUENCY) * 3
    const resultLength = feedData.length + totalExternalItems
    const result = new Array<CombinedFeedItem>(resultLength)

    // Copy feed data first
    let resultIndex = 0
    feedData.forEach((item: FeedItem, i: number) => {
      result[resultIndex] = item
      resultIndex++

      // Insert external content every POST_FREQUENCY items
      if ((i + 1) % POST_FREQUENCY === 0) {
        const externalIndex = Math.floor(i / POST_FREQUENCY)

        // Insert insight
        if (insights[externalIndex]) {
          result[resultIndex] = { insight: insights[externalIndex] }
          resultIndex++
        }

        // Insert good news
        if (articles[externalIndex]) {
          result[resultIndex] = { goodNewsArticle: articles[externalIndex] }
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
    dataInsights?.feedInsights?.data,
    dataGoodNews?.appGoodNews_articles?.articles,
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
            prev.feed.data.map((post: FeedItem) => post.feedPost?.id || post.spacePost?.id || post.post?.id)
          )

          const newPosts = fetchMoreResult.feed.data.filter((newItem: FeedItem) => {
            const newId = newItem.feedPost?.id || newItem.spacePost?.id || newItem.post?.id
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

  useOnRefresh(refetch)
  useOnRefresh(refetchGoodNews)
  useOnRefresh(refetchInsights)

  return {
    initialLoading,
    isLoading: loading || isLoadingMore,
    canLoadMore,
    combinedFeedData,
    fetchMore: handleFetchMore,
    insightsCreators,
  }
}
