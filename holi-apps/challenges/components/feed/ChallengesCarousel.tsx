import { ChallengesCarouselCard } from '@holi-apps/challenges/components/feed/ChallengesCarouselCard'
import type { Challenge, ChallengeTeaser } from '@holi-apps/challenges/components/types'
import { challengeAppBaseUrl } from '@holi-apps/challenges/config'
import { createInAppChallengesPath } from '@holi-apps/challenges/helpers/navigation'
import { useChallengesHeaders } from '@holi-apps/challenges/helpers/useChallengesHeaders'
import ChallengesSlider from '@holi-apps/challenges/components/feed/ChallengesSlider'
import { logError } from '@holi/core/errors/helpers'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import { TrackingEvent } from '@holi/core/tracking'
import type { ListItemIdentifier, ListItemTrackingEvent } from '@holi/core/tracking/TrackableFlatList.shared'
import { withProfiler } from '@sentry/react'
import fetch from 'cross-fetch'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const API_URL = challengeAppBaseUrl + '/api/v1/recommended-challenges'
const CARD_WIDTH = 130

const ChallengesCarousel = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [challenges, setChallenges] = useState<ChallengeTeaser[]>([])
  const { t } = useTranslation()
  const headers = useChallengesHeaders()

  const fetchChallenges = useCallback(async () => {
    if (!headers) {
      return
    }

    try {
      setIsLoading(true)
      const apiHeaders = new Headers(headers)
      apiHeaders.append('Accept', 'application/json')
      const response = await fetch(API_URL, { headers: apiHeaders })

      if (!response.ok) {
        throw new Error('Failed to fetch recommended challenges')
      }

      const data = await response.json()
      setChallenges(data)
    } catch (error) {
      logError(error, 'Error fetching challenges', {
        location: 'RecommendedChallenges.fetchChallenges',
      })
      setChallenges([])
    } finally {
      setIsLoading(false)
    }
  }, [headers])

  useEffect(() => {
    fetchChallenges()
  }, [fetchChallenges])

  useOnRefresh(fetchChallenges)

  // Don't render anything if we're loading or have no challenges
  if (isLoading || !challenges || challenges.length === 0) {
    return null
  }

  const listItemTrackingEvent: ListItemTrackingEvent<Challenge> = ({ title, id }) => {
    return TrackingEvent.RecommendationViewed('challenge', { title, id })
  }

  const listItemIdentifier: ListItemIdentifier<Challenge> = ({ id }) => {
    return id
  }

  return (
    <ChallengesSlider
      viewTrackingParams={{
        listItemTrackingEvent,
        listItemIdentifier,
      }}
      challenges={challenges}
      renderItem={({ item, index }: { item: ChallengeTeaser; index: number }) => (
        <ChallengesCarouselCard
          challenge={item}
          trackingEvent={TrackingEvent.ChallengeCard.CardPressed(item.id, index)}
          cardWidth={CARD_WIDTH}
        />
      )}
      heading={t('challenges:feed.carousel.title')}
      subline={t('challenges:feed.carousel.subline')}
      seeAllPath={createInAppChallengesPath('/challenges')}
      labelSeeMore={t('challenges:carousel.seeMore')}
      cardWidth={CARD_WIDTH}
    />
  )
}

export default withProfiler(ChallengesCarousel, {
  name: 'ChallengesCarousel',
})
