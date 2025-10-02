import type React from 'react'

import type { FeatureFlagKey } from '@holi/core/featureFlags/constants'

// eslint-disable-next-line no-restricted-imports
import FeatureFlagGuard from '../components/FeatureFlagGuard'

export function withFeatureFlagGuard<P extends object>(
  Component: React.ComponentType<P>,
  flag: FeatureFlagKey
): React.ComponentType<P> {
  const WithFeatureFlagGuard = (props: P) => {
    return (
      <FeatureFlagGuard flag={flag}>
        <Component {...props} />
      </FeatureFlagGuard>
    )
  }

  WithFeatureFlagGuard.displayName = `withFeatureFlagGuard(${Component.displayName || Component.name || 'Component'})`

  return WithFeatureFlagGuard
}
