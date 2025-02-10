import { useCallback } from 'react'
import { TrackingEvent } from '@holi/core/tracking'
import type { FeedItem } from '@holi/core/screens/homeFeed/types'
import type { VolunteeringReco } from '@holi-apps/volunteering/types'
import type { GoodNewsArticle } from '@holi-apps/goodnews/types'

export const useFeedStats = (
  combinedFeedData: (FeedItem & {
    goodNewsArticle?: GoodNewsArticle
    volunteeringReco?: VolunteeringReco
  })[],
  lastViewedIndex: number,
  track: (event: TrackingEvent) => void
) => {
  const getFeedStats = useCallback(() => {
    const viewedItems = combinedFeedData.slice(0, lastViewedIndex + 1)

    const stats = viewedItems.reduce(
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
  }, [combinedFeedData, lastViewedIndex, track])

  return getFeedStats
}
