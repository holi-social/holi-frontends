import { withProfiler } from '@sentry/react'
import React, { memo } from 'react'
import PosthogFeatureFlagGuard from '@holi/core/featureFlags/components/PosthogFeatureFlagGuard'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import createParamHooks from '@holi/core/navigation/hooks/useParam'

import { useFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag'
import { VolunteeringDetailsScreenTypesense } from '@holi-apps/volunteering/components/VolunteeringDetailsScreenTypesense'
import { VolunteeringDetailsScreen } from '@holi-apps/volunteering/components/VolunteeringDetailsScreen'

export type VolunteeringEngagementDetailParams = {
  engagementId: string
}

const { useParam } = createParamHooks<VolunteeringEngagementDetailParams>()

export const VolunteeringEngagementDetail = () => {
  const [engagementId = ''] = useParam('engagementId')

  const [useTypesense] = useFeatureFlag(FeatureFlagKey.TYPESENSE_RECOS)

  return useTypesense ? (
    <VolunteeringDetailsScreenTypesense engagementId={engagementId} />
  ) : (
    <VolunteeringDetailsScreen engagementId={engagementId} />
  )
}

const WrappedVolunteeringEngagementDetail = () => (
  <PosthogFeatureFlagGuard featureFlagKey={FeatureFlagKey.VOLUNTEERING} i18nKey="volunteering:maintenance.feature">
    <VolunteeringEngagementDetail />
  </PosthogFeatureFlagGuard>
)

export default withProfiler(memo(WrappedVolunteeringEngagementDetail), { name: 'VolunteeringEngagementDetail' })
