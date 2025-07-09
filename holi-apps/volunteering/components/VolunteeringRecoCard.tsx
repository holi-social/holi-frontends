import React from 'react'
import type { DimensionValue } from 'react-native'
import type { LocalizedTypesenseDocument } from '@holi/core/typesense/types'
import { Global, MapPin2Filled, Refresh, Time } from '@holi/icons/src/generated'
import { CompactCard } from 'holi-bricks/components/compactCard'
import { useTranslation } from 'react-i18next'
import type { ChipLabelProps } from 'holi-bricks/components/chips/ChipLabel'
import { HoliLinkTracked } from '@holi/core/components/Trackable'
import { linkFromLocator } from '@holi/core/typesense/helpers/linkFromLocator'
import { TrackingEvent } from '@holi/core/tracking'
import { getInitials } from '@holi/core/helpers'

interface VolunteeringRecoCardProps {
  engagement: LocalizedTypesenseDocument
  index: number
  fixedWidth?: DimensionValue
  trackingEvent?: TrackingEvent
}

export const VolunteeringRecoCard = ({ engagement, index, fixedWidth, trackingEvent }: VolunteeringRecoCardProps) => {
  const { t } = useTranslation()
  const isRemote = engagement.location_type === 'remote'
  const link = linkFromLocator(engagement.type, engagement.link_locators)
  const linkLabel = engagement?.organizer_name
    ? t('volunteering.engagement.title', {
        title: engagement.title,
        organization: engagement.organizer_name,
        interpolation: { escapeValue: false },
      })
    : (engagement.title ?? '')

  const footerChips: ChipLabelProps[] = []
  if (engagement.commitment_label) {
    footerChips.push({
      color: 'blue',
      size: 'md',
      iconLeading: Refresh,
      children: t(`volunteering.engagement.commitment_label.${engagement.commitment_label}`),
    })
  }
  if (engagement.commitment_duration && engagement.commitment_duration !== 'INDETERMINATE') {
    footerChips.push({
      color: 'blue',
      size: 'md',
      iconLeading: Time,
      children: t(`volunteering.engagement.commitment_duration.${engagement.commitment_duration}`),
    })
  }

  return (
    <HoliLinkTracked
      href={link}
      label={linkLabel}
      trackingEvent={
        trackingEvent ??
        TrackingEvent.RecommendationPressed(
          engagement.type === 'task' ? 'space_task' : 'volunteering_opportunity',
          engagement.id,
          index,
          {
            commitmentType: engagement.commitment_label,
            locationType: engagement.location_type,
            source: engagement.source,
            sourceSection: 'Volunteering',
          }
        )
      }
      isFullHeight={!!fixedWidth}
      testID={`${engagement.type}-reco-card`}
    >
      <CompactCard
        title={engagement.title}
        subtitle={
          engagement.organizer_name
            ? t('volunteering.engagement.organization', { organization: engagement.organizer_name })
            : ''
        }
        imageSrc={engagement.image_url}
        avatar={
          engagement.organizer_name
            ? {
                source: engagement.organizer_image_url,
                label: engagement.organizer_name,
                initials: getInitials(engagement.organizer_name),
              }
            : undefined
        }
        topLabelIcon={isRemote ? Global : engagement.location ? MapPin2Filled : undefined}
        topLabel={isRemote ? t('volunteering.engagement.location_type.remote') : engagement.location}
        fixedWidth={fixedWidth}
        fullHeight={!!fixedWidth}
        imageLabel={t('volunteering.engagement.thumbnail.label')}
        fallbackImageHashKey={engagement.id}
      >
        <CompactCard.FooterChips chips={footerChips} />
      </CompactCard>
    </HoliLinkTracked>
  )
}
