import { ChallengeCard, calculateCardWidth } from '@holi-apps/challenges/components/ChallengeCard'
import type { Challenge } from '@holi-apps/challenges/components/types'
import { challengeAppBaseUrl } from '@holi-apps/challenges/config'
import { createInAppChallengesPath } from '@holi-apps/challenges/helpers/navigation'
import { useChallengesHeaders } from '@holi-apps/challenges/helpers/useChallengesHeaders'
import RecoSlider from '@holi/core/components/RecoSlider'
import { logError } from '@holi/core/errors/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import { TrackingEvent } from '@holi/core/tracking'
import type { ListItemIdentifier, ListItemTrackingEvent } from '@holi/core/tracking/TrackableFlatList.shared'
import { StarSmileFilled } from '@holi/icons/src/generated'
import { withProfiler } from '@sentry/react'
import fetch from 'cross-fetch'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useWindowDimensions } from 'react-native'

const API_URL = challengeAppBaseUrl + '/api/v1/challenge-with-submissions'
const MAX_ITEMS_TO_DISPLAY = 5

interface RecommendedChallengesResult {
  challenges: Challenge[]
  allChallengePath: string
}

const RecommendedChallenges = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [allChallengePath, setAllChallengePath] = useState('')
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { width: screenWidth } = useWindowDimensions()
  const cardWidth = calculateCardWidth(screenWidth)
  const headers = useChallengesHeaders()

  const fetchChallenges = useCallback(async () => {
    if (!headers) {
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch(API_URL, { headers: new Headers(headers) })

      if (!response.ok) {
        throw new Error('Failed to fetch recommended challenges')
      }

      const data: RecommendedChallengesResult = await response.json()
      setChallenges(data.challenges)
      setAllChallengePath(data.allChallengePath)
    } catch (error) {
      logError(error, 'Error fetching challenges', {
        location: 'RecommendedChallenges.fetchChallenges',
      })
    } finally {
      setIsLoading(false)
    }
  }, [headers])

  useEffect(() => {
    fetchChallenges()
  }, [fetchChallenges])
  useOnRefresh(fetchChallenges)

  if (!isLoading && !challenges.length) {
    return null
  }

  const listItemTrackingEvent: ListItemTrackingEvent<Challenge> = ({ title, id }) => {
    return TrackingEvent.RecommendationViewed('challenge', { title, id })
  }

  const listItemIdentifier: ListItemIdentifier<Challenge> = ({ id }) => {
    return id
  }

  return (
    <RecoSlider
      name="challenges"
      viewTrackingParams={{
        listItemTrackingEvent,
        listItemIdentifier,
      }}
      renderItem={({ item, index }: { item: Challenge; index: number }) => (
        <ChallengeCard challenge={item} trackingEvent={TrackingEvent.ChallengeCard.CardPressed(item.id, index)} />
      )}
      data={challenges.slice(0, MAX_ITEMS_TO_DISPLAY)}
      icon={StarSmileFilled}
      heading={t('challenges:recommendations.title')}
      subline={t('challenges:recommendations.subline')}
      seeAllPath={createInAppChallengesPath()}
      onPressSeeMore={() => navigate(createInAppChallengesPath(allChallengePath))}
      labelSeeMore={t('global.seeMore')}
      loading={isLoading}
      cardWidth={cardWidth}
    />
  )
}

export default withProfiler(RecommendedChallenges, {
  name: 'RecommendedChallenges',
})
