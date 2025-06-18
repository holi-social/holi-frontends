import { useRandomizedRecos } from '@holi-apps/volunteering/hooks/useRandomizedRecos'
import { useVolunteeringRecos } from '@holi-apps/volunteering/hooks/useVolunteeringRecos'
import type { LocalizedTypesenseDocument } from '@holi/core/typesense/types'

interface UseRandomizedVolunteeringRecos {
  pageSize?: number
}
export const useRandomizedVolunteeringRecos = ({ pageSize }: UseRandomizedVolunteeringRecos = {}) => {
  const { engagements: typesenseEngagements } = useVolunteeringRecos({
    pageSize,
  })

  const randomizedEngagements = useRandomizedRecos<LocalizedTypesenseDocument>(typesenseEngagements, pageSize)

  return randomizedEngagements
}
