import { useRandomizedRecos } from '@holi-apps/volunteering/hooks/useRandomizedRecos'
import { useVolunteeringRecosTypesense } from '@holi-apps/volunteering/hooks/useVolunteeringRecosTypesense'
import type { LocalizedTypesenseDocument } from '@holi/core/typesense/types'

interface UseRandomizedVolunteeringRecos {
  pageSize?: number
}
export const useRandomizedVolunteeringRecos = ({ pageSize }: UseRandomizedVolunteeringRecos = {}) => {
  const { engagements: typesenseEngagements } = useVolunteeringRecosTypesense({
    pageSize,
  })

  const randomizedEngagements = useRandomizedRecos<LocalizedTypesenseDocument>(typesenseEngagements, pageSize)

  return randomizedEngagements
}
