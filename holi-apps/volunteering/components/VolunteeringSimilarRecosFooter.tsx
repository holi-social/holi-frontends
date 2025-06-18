import React from 'react'
import { VolunteeringSimilarRecosTypesense } from '@holi-apps/volunteering/components/VolunteeringSimilarRecosTypesense'

export const VolunteeringSimilarRecosFooter = ({ engagementId }: { engagementId: string }) => {
  return <VolunteeringSimilarRecosTypesense documentId={`volunteering_${engagementId}`} />
}
