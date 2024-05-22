import { withProfiler } from '@sentry/react'
import React from 'react'

import FeatureToggleGuard from '@holi/core/components/FeatureToggleGuard'
import { FeatureToggleName } from '@holi/core/helpers/useFeatureToggle'
import createParamHooks from '@holi/core/navigation/hooks/useParam'

import { challengeAppBaseUrl } from '@holi-apps/challenges/config'
import { ChallengesAppHomeParams } from '@holi-apps/challenges/screens/ChallengesAppHome.shared'

const { useParam } = createParamHooks<ChallengesAppHomeParams>()

const ChallengesAppHome = () => {
  const [pathQueryParam] = useParam('path')

  // Immediately redirect to the challenges web app
  const uri = new URL(challengeAppBaseUrl)
  if (pathQueryParam) {
    uri.pathname = decodeURIComponent(pathQueryParam)
  }
  window.location.href = uri.toString()
  return null
}

const WrappedChallengesAppHome = () => (
  <FeatureToggleGuard toggleName={FeatureToggleName.CHALLENGES} featureNameKey="challenges:maintenance.feature">
    <ChallengesAppHome />
  </FeatureToggleGuard>
)

export default withProfiler(WrappedChallengesAppHome, { name: 'ChallengesAppHome' })
