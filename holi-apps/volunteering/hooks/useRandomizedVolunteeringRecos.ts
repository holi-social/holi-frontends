import { useRandomizedRecos } from '@holi-apps/volunteering/hooks/useRandomizedRecos'
import { useVolunteeringRecosLegacy } from '@holi-apps/volunteering/hooks/useVolunteeringRecosLegacy'
import { useVolunteeringRecosTypesense } from '@holi-apps/volunteering/hooks/useVolunteeringRecosTypesense'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { useFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag'

interface UseRandomizedVolunteeringRecos {
  pageSize?: number
}
export const useRandomizedVolunteeringRecos = ({ pageSize }: UseRandomizedVolunteeringRecos = {}) => {
  const [useTypesense] = useFeatureFlag(FeatureFlagKey.TYPESENSE_RECOS)
  const { engagements: typesenseEngagements } = useVolunteeringRecosTypesense({
    pageSize,
    skip: !useTypesense,
  })
  const { engagements: legacyEngagements } = useVolunteeringRecosLegacy({
    pageSize,
    skip: useTypesense == undefined || !!useTypesense,
  })

  const randomizedEngagements = useRandomizedRecos(useTypesense ? typesenseEngagements : legacyEngagements, pageSize)

  return randomizedEngagements
}
