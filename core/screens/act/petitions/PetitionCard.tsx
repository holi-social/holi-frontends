import React from 'react'
import { HoliLinkTracked } from '@holi/core/components/Trackable'
import { PencilFilled } from '@holi/icons/src/generated'
import { CompactCard } from 'holi-bricks/components/compactCard'
import { useTranslation } from 'react-i18next'
import { TrackingEvent } from '@holi/core/tracking'
import { usePetitionStatuses } from '@holi/core/screens/userprofile/hooks/usePetitionStatuses'
import { usePetitionStatusQuery } from '@holi/api/graphql/graphql-codegen'

export type Petition = {
  description: string
  initiators: string[]
  petitionSuccessful: boolean
  signatures: number
  slug: string
  tag: string
  targets: string[]
  title: string
  id: string
}

export interface PetitionProps {
  petition: Petition
  maxCardWidth?: number
  showCommitmentStatus?: boolean
}

const PetitionCard = ({ petition, maxCardWidth: cardWidth, showCommitmentStatus }: PetitionProps) => {
  const { t } = useTranslation()

  const {
    data: { petitionStatus } = {},
  } = usePetitionStatusQuery({
    variables: {
      petitionId: petition.id,
    },
  })

  const { getPetitionStatus } = usePetitionStatuses()
  const statusChip = petitionStatus?.status ? getPetitionStatus(petitionStatus.status) : null

  if (!petition) {
    return null
  }

  return (
    <HoliLinkTracked
      trackingEvent={TrackingEvent.Petitions.pressed(petition.id)}
      label={petition.title}
      href={`/petitions/${petition.id}`}
      isFullHeight
    >
      <CompactCard
        title={petition.title}
        subtitle={petition.tag}
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
