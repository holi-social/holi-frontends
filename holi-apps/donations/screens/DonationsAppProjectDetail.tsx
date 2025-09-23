import { withProfiler } from '@sentry/react'
import React, { memo } from 'react'

import PosthogFeatureFlagGuard from '@holi/core/featureFlags/components/PosthogFeatureFlagGuard'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import createParamHooks from '@holi/core/navigation/hooks/useParam'

import { DonationDetailView } from '@holi-apps/donations/components/DonationDetailView'

export type DonationsAppProjectDetailParams = {
  projectId: string
}

const { useParam } = createParamHooks<DonationsAppProjectDetailParams>()

const DonationsAppProjectDetail = () => {
  const [projectId = ''] = useParam('projectId')

  return <DonationDetailView projectId={projectId} />
}

const WrappedDonationsAppProjectDetail = () => (
  <PosthogFeatureFlagGuard featureFlagKey={FeatureFlagKey.DONATIONS} i18nKey="donations.maintenance.feature">
    <DonationsAppProjectDetail />
  </PosthogFeatureFlagGuard>
)

export default withProfiler(memo(WrappedDonationsAppProjectDetail), { name: 'DonationsAppProjectDetail' })
