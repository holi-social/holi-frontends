import { ChallengesCarouselCard } from '@holi-apps/challenges/components/feed/ChallengesCarouselCard'
import type { Challenge, ChallengeTeaser } from '@holi-apps/challenges/components/types'
import { createInAppChallengesPath } from '@holi-apps/challenges/helpers/navigation'
import { useChallengesHeaders } from '@holi-apps/challenges/helpers/useChallengesHeaders'
import ChallengesSlider from '@holi-apps/challenges/components/feed/ChallengesSlider'
import { logError } from '@holi/core/errors/helpers'
import { TrackingEvent } from '@holi/core/tracking'
import type { ListItemIdentifier, ListItemTrackingEvent } from '@holi/core/tracking/TrackableFlatList.shared'
import { withProfiler } from '@sentry/react'
import fetch from 'cross-fetch'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import { Spacing } from 'holi-bricks/foundations/dimensions/spacing'
import { Stack } from 'holi-bricks/components/stack'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { apiUrl } from '@holi-apps/challenges/helpers/navigation'

const API_URL = apiUrl('/api/v1/recommended-challenges')
const CARD_WIDTH = 130

interface ChallengesCarouselProps {
  refreshing?: boolean
}

const ChallengesCarousel = ({ refreshing }: ChallengesCarouselProps) => {
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [challenges, setChallenges] = useState<ChallengeTeaser[]>([])
  const { t } = useTranslation()
  const headers = useChallengesHeaders()

  const fetchChallenges = useCallback(
    async (showLoading = false) => {
      if (!headers) {
        return
      }

      try {
        if (showLoading) {
          setIsInitialLoading(true)
        }

        const apiHeaders = new Headers(headers)
        apiHeaders.append('Accept', 'application/json')
        const response = await fetch(API_URL, { headers: apiHeaders, credentials: 'include' })

        if (!response.ok) {
          throw new Error('Failed to fetch recommended challenges')
        }

        const data = await response.json()
        const shuffledData = [...data].sort(() => Math.random() - 0.5)
        setChallenges(shuffledData)
      } catch (error) {
        logError(error, 'Error fetching challenges', {
          location: 'RecommendedChallenges.fetchChallenges',
        })
        setChallenges([])
      } finally {
        if (showLoading) {
          setIsInitialLoading(false)
        }
      }
    },
    [headers]
  )

  // Initial fetch on mount - show loading state
  useEffect(() => {
    fetchChallenges(true)
  }, [fetchChallenges])

  // Fetch silently when parent is refreshing
  useEffect(() => {
    if (refreshing) {
      fetchChallenges(false)
    }
  }, [refreshing, fetchChallenges])

  const listItemTrackingEvent: ListItemTrackingEvent<Challenge> = ({ title, id }) => {
    return TrackingEvent.RecommendationViewed('challenge', { title, id })
  }

  const listItemIdentifier: ListItemIdentifier<Challenge> = ({ id }) => {
    return id
  }

  // Show skeleton only during initial loading
  if (isInitialLoading) {
    return (
      <Stack direction="column" gap="3xs">
        <HoliSkeleton height={Spacing.sm} width={180} borderRadius={16} />
        <Stack direction="row" gap="3xs">
          {[...Array(3)].map((_, index) => (
            <Stack direction="column" gap="3xs" key={index}>
              <HoliSkeleton height={CARD_WIDTH} width={CARD_WIDTH} borderRadius={16} />
              <HoliSkeleton height={Spacing.xs} width={CARD_WIDTH - Spacing.xs} borderRadius={16} />
              <HoliSkeleton height={Spacing.xs} width={CARD_WIDTH - Spacing.md} borderRadius={16} />
            </Stack>
          ))}
        </Stack>
        <HoliGap size="l" />
      </Stack>
    )
  }

  // Show nothing if there are no challenges
  if (!challenges || challenges.length === 0) {
    return null
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
          trackingEvent={TrackingEvent.ChallengeCard.CardPressed(item.id, item.title, index, 'home')}
          cardWidth={CARD_WIDTH}
        />
      )}
      heading={t('challenges.feed.carousel.title')}
      seeAllPath={createInAppChallengesPath('/')}
      labelSeeMore={t('challenges.carousel.seeMore')}
      cardWidth={CARD_WIDTH}
    />
  )
}

export default withProfiler(ChallengesCarousel, {
  name: 'ChallengesCarousel',
})
