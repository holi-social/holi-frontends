import { withProfiler } from '@sentry/react'
import React, { memo } from 'react'
import PosthogFeatureFlagGuard from '@holi/core/featureFlags/components/PosthogFeatureFlagGuard'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import createParamHooks from '@holi/core/navigation/hooks/useParam'

import { VolunteeringDetailsScreenTypesense } from '@holi-apps/volunteering/components/VolunteeringDetailsScreenTypesense'

export type VolunteeringEngagementDetailParams = {
  engagementId: string
}

const { useParam } = createParamHooks<VolunteeringEngagementDetailParams>()

export const VolunteeringEngagementDetail = () => {
  const [engagementId = ''] = useParam('engagementId')

  return <VolunteeringDetailsScreenTypesense engagementId={engagementId} />
}

const WrappedVolunteeringEngagementDetail = () => (
  <PosthogFeatureFlagGuard featureFlagKey={FeatureFlagKey.VOLUNTEERING} i18nKey="volunteering:maintenance.feature">
    <VolunteeringEngagementDetail />
  </PosthogFeatureFlagGuard>
)

export default withProfiler(memo(WrappedVolunteeringEngagementDetail), { name: 'VolunteeringEngagementDetail' })
