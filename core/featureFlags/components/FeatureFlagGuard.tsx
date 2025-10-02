import React, { type PropsWithChildren } from 'react'

import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { useFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag'

interface FeatureFlagGuardProps {
  flag: FeatureFlagKey
}

const FeatureFlagGuard = ({ flag, children }: PropsWithChildren<FeatureFlagGuardProps>) => {
  const [value] = useFeatureFlag(flag)

  if (!value || value === 'off') {
    return null
  }

  return <>{children}</>
}

export default FeatureFlagGuard
