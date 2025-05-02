import { useCallback, useMemo } from 'react'
import { TrackingEvent } from '@holi/core/tracking'
import type { CombinedFeedItem } from '@holi/core/screens/homeFeed/types'

export const useFeedStats = (
  combinedFeedData: CombinedFeedItem[],
  lastViewedIndex: number,
  track: (event: TrackingEvent) => void
) => {
  // Memoize the stats calculation
  const stats = useMemo(() => {
    const viewedItems = combinedFeedData.slice(0, lastViewedIndex + 1)

    return viewedItems.reduce(
      (acc, item) => ({
        feedPosts: acc.feedPosts + (item.feedPost ? 1 : 0),
        spacePosts: acc.spacePosts + (item.spacePost ? 1 : 0),
        insights: acc.insights + (item.insight ? 1 : 0),
        goodNews: acc.goodNews + (item.goodNewsArticle ? 1 : 0),
        volunteering: acc.volunteering + (item.volunteeringReco ? 1 : 0),
        total: acc.total + 1,
      }),
      {
        feedPosts: 0,
        spacePosts: 0,
        insights: 0,
        goodNews: 0,
        volunteering: 0,
        total: 0,
      }
    )
  }, [combinedFeedData, lastViewedIndex])

  // Now getFeedStats only depends on stable stats and track function
  const getFeedStats = useCallback(() => {
    track(
      TrackingEvent.FeedPosts.viewSummary(
        stats.total,
        stats.feedPosts,
        stats.spacePosts,
        stats.goodNews,
        stats.insights,
        stats.volunteering
      )
    )
  }, [stats, track])

  return getFeedStats
}
