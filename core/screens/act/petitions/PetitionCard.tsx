import React from 'react'
import { HoliLinkTracked } from '@holi/core/components/Trackable'
import { CalendarEventLine } from '@holi/icons/src/generated'
import { CompactCard } from 'holi-bricks/components/compactCard'
import { useTranslation } from 'react-i18next'
import { TrackingEvent } from '@holi/core/tracking'

export type Petition = {
  id: string
  title: string
  category: string
  daysLeft: number
  percentage: number
  imageUrl: string
  startedBy: string
  targetOrganisation: string
  description: string
  externalLink?: string
}

export interface PetitionProps {
  petition: Petition
  maxCardWidth?: number
}

const PetitionCard = ({ petition, maxCardWidth: cardWidth }: PetitionProps) => {
  const { t } = useTranslation()

  return (
    <HoliLinkTracked
      trackingEvent={TrackingEvent.Petitions.pressed(petition.id)}
      label={petition.title}
      href={`/petitions/${petition.id}`}
      isFullHeight
    >
      <CompactCard
        title={petition.title}
        topLabel={t('act.petitions.daysLeft', { days: petition.daysLeft || 'unlimited' })}
        subtitle={t(`act.petitions.category.${petition.category}`)}
        topLabelIcon={CalendarEventLine}
        imageSrc={petition.imageUrl}
        maxWidth={cardWidth}
        minHeight={131}
        imageLabel={t('act.petitions.thumbnail.label')}
      >
        <CompactCard.FooterProgressBar
          progressBarPercentage={petition.percentage}
          progressBarLeft={t('act.petitions.percent', { percentage: petition.percentage })}
        />
      </CompactCard>
    </HoliLinkTracked>
  )
}

export default PetitionCard
