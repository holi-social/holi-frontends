import { withProfiler } from '@sentry/react'
import React from 'react'

import createParamHooks from '@holi/core/navigation/hooks/useParam'

import { challengesPathWithSessionTransfer } from '@holi-apps/challenges/helpers/navigation'
import type { ChallengesAppHomeParams } from '@holi-apps/challenges/screens/ChallengesAppHome.shared'

const { useParam } = createParamHooks<ChallengesAppHomeParams>()

const ChallengesAppHome = () => {
  const [pathQueryParam] = useParam('path')

  // Immediately redirect to the challenges web app
  const uri = challengesPathWithSessionTransfer(pathQueryParam)
  window.location.href = uri
  return null
}

export default withProfiler(() => <ChallengesAppHome />, { name: 'ChallengesAppHome' })
