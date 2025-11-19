import React from 'react'
import { HoliLinkTracked } from '@holi/core/components/Trackable'
import { PencilFilled } from '@holi/icons/src/generated'
import { CompactCard } from 'holi-bricks/components/compactCard'
import { useTranslation } from 'react-i18next'
import { TrackingEvent } from '@holi/core/tracking'
import { usePetitionStatuses } from '@holi/core/screens/userprofile/hooks/usePetitionStatuses'
import type { PetitionStatusValue } from '@holi/api/graphql/graphql-codegen'
import petitions from './petitions.json'

export type Petition = {
  externalPetitionId: string
  status: PetitionStatusValue
}

export interface PetitionProps {
  externalPetitionId: string
  status: PetitionStatusValue
  maxCardWidth?: number
  showCommitmentStatus?: boolean
}

const PetitionCard = ({
  externalPetitionId,
  status,
  maxCardWidth: cardWidth,
  showCommitmentStatus = false,
}: PetitionProps) => {
  const petitionById = petitions.find((petitionItem) => petitionItem.id === externalPetitionId)

  const { t } = useTranslation()
  const { getPetitionStatus } = usePetitionStatuses()
  const statusChip = getPetitionStatus(status)

  if (!petitionById) {
    return null
  }

  return (
    <HoliLinkTracked
      trackingEvent={TrackingEvent.Petitions.pressed(petitionById.id)}
      label={petitionById.title}
      href={`/petitions/${petitionById.id}`}
      isFullHeight
    >
      <CompactCard
        title={petitionById.title}
        subtitle={t(`act.petitions.category.${petitionById.category}`)}
        imageSrc={petitionById.imageUrl}
        maxWidth={cardWidth}
        minHeight={131}
        imageLabel={t('act.petitions.thumbnail.label')}
        fullHeight
      >
        {petitionById.signatures && !showCommitmentStatus && (
          <CompactCard.FooterChips
            chips={[
              {
                iconLeading: PencilFilled,
                children: t('act.petitions.signatureCount', {
                  signatureCount: petitionById.signatures.toLocaleString('de-DE'),
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
