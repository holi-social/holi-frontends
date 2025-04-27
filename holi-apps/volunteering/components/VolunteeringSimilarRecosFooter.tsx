import React from 'react'
import { useFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { VolunteeringSimilarRecosTypesense } from '@holi-apps/volunteering/components/VolunteeringSimilarRecosTypesense'
import { VolunteeringSimilarRecosLegacy } from '@holi-apps/volunteering/components/VolunteeringSimilarRecosLegacy'

export const VolunteeringSimilarRecosFooter = ({ engagementId }: { engagementId: string }) => {
  const [useTypesense] = useFeatureFlag(FeatureFlagKey.TYPESENSE_RECOS)
  return useTypesense ? (
    <VolunteeringSimilarRecosTypesense engagementId={engagementId} />
  ) : (
    <VolunteeringSimilarRecosLegacy engagementId={engagementId} />
  )
}
