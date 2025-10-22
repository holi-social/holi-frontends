import React from 'react'
import { HoliLinkTracked } from '@holi/core/components/Trackable'
import { PencilFilled } from '@holi/icons/src/generated'
import { CompactCard } from 'holi-bricks/components/compactCard'
import { useTranslation } from 'react-i18next'
import { TrackingEvent } from '@holi/core/tracking'
import { usePetitionStatuses } from '@holi/core/screens/userprofile/hooks/usePetitionStatuses'
import type { PetitionStatusValue } from '@holi/core/screens/act/petitions/PetitionDetails'

export type Petition = {
  id: string
  title: string
  category: string // e.g. "health"
  daysLeft: number
  percentage: number
  imageUrl: string
  startedBy: string
  targetOrganisation: string
  description: string
  externalLink?: string
  signatures?: number // number of signatures yet
  status: PetitionStatusValue // TO_SIGN | COMPLETED
}

export interface PetitionProps {
  petition: Petition
  maxCardWidth?: number
  showCommitmentStatus?: boolean
}

const PetitionCard = ({ petition, maxCardWidth: cardWidth, showCommitmentStatus = false }: PetitionProps) => {
  const { t } = useTranslation()
  const { getPetitionStatus } = usePetitionStatuses()
  const statusChip = getPetitionStatus(petition.status)

  return (
    <HoliLinkTracked
      trackingEvent={TrackingEvent.Petitions.pressed(petition.id)}
      label={petition.title}
      href={`/petitions/${petition.id}`}
      isFullHeight
    >
      <CompactCard
        title={petition.title}
        subtitle={t(`act.petitions.category.${petition.category}`)}
        imageSrc={petition.imageUrl}
        maxWidth={cardWidth}
        minHeight={131}
        imageLabel={t('act.petitions.thumbnail.label')}
        fullHeight
      >
        {petition.signatures && !showCommitmentStatus && (
          <CompactCard.FooterChips
            chips={[
              {
                iconLeading: PencilFilled,
                children: t('act.petitions.signatureCount', {
                  signatureCount: petition.signatures.toLocaleString('de-DE'),
                }),
              },
            ]}
          />
        )}
        {showCommitmentStatus && statusChip?.chip && <CompactCard.FooterChips chips={[statusChip.chip]} />}
      </CompactCard>
    </HoliLinkTracked>
  )
}

export default PetitionCard
