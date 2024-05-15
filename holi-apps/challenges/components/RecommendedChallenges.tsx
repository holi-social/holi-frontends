import { withProfiler } from '@sentry/react'
import fetch from 'cross-fetch'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, ViewStyle } from 'react-native'

import { createAuthorizationHeaders } from '@holi/api/helpers'
import { HOLI_APPS } from '@holi/core/constants/appConstants'
import { logError } from '@holi/core/errors/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import AppUpdatesList from '@holi/core/screens/appsHub/components/AppUpdatesList'
import { StarSmileFilled } from '@holi/icons/src/generated'

import { ChallengeCard } from '@holi-apps/challenges/components/ChallengeCard'
import type { Challenge } from '@holi-apps/challenges/components/types'
import { challengeAppBaseUrl } from '@holi-apps/challenges/config'
import { createChallengesPath } from '@holi-apps/challenges/helpers/navigation'

const API_URL = challengeAppBaseUrl + '/api/v1/challenge-with-submissions'
const MAX_ITEMS_TO_DISPLAY = 5

interface RecommendedChallengesResult {
  challenges: Challenge[]
  allChallengePath: string
}

interface RecommendedChallengesProps {
  style?: StyleProp<ViewStyle>
}

export const RecommendedChallenges = ({ style }: RecommendedChallengesProps) => {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [allChallengePath, setAllChallengePath] = useState('')
  const { t } = useTranslation()
  const { navigate } = useRouting()

  useEffect(() => {
    createAuthorizationHeaders().then((headers) =>
      fetch(API_URL, { headers: new Headers(headers) })
        .then((res) =>
          res.json().then(({ allChallengePath, challenges }: RecommendedChallengesResult) => {
            setChallenges(challenges)
            setAllChallengePath(allChallengePath)
          })
        )
        .catch((error) => {
          logError(error, 'Error fetching challenges', {
            location: 'RecommendedChallenges.useEffect',
          })
        })
    )
  }, [])

  // TODO(SF) handle loading?
  if (!challenges.length) {
    return null
  }

  return (
    <AppUpdatesList
      appName={HOLI_APPS.CHALLENGES}
      renderItem={({ item }) => <ChallengeCard challenge={item} />}
      data={challenges.slice(0, MAX_ITEMS_TO_DISPLAY)}
      appIcon={StarSmileFilled}
      heading={t('challenges:recommendations.title')}
      subline={t('challenges:recommendations.subline')}
      onPressSeeMore={() => navigate(createChallengesPath(allChallengePath))}
      labelSeeMore={t('global.seeMore')}
      loading={!challenges.length}
      style={style}
    />
  )
}

export default withProfiler(RecommendedChallenges, { name: 'RecommendedChallenges' })
