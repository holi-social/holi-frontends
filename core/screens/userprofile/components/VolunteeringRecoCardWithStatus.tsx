import React from 'react'
import type { DimensionValue } from 'react-native'
import { Global, MapPin2Filled } from '@holi/icons/src/generated'
import { CompactCard } from 'holi-bricks/components/compactCard'
import { useTranslation } from 'react-i18next'
import { HoliLinkTracked } from '@holi/core/components/Trackable'
import { TrackingEvent } from '@holi/core/tracking'
import { getInitials } from '@holi/core/helpers'
import type { NormalizedCommittedVolunteeringItem } from '@holi/core/screens/userprofile/hooks/useCommittedVolunteering'
import { useMyVolunteeringStatuses } from '@holi/core/screens/userprofile/hooks/useMyVolunteeringStatuses'
import { getLocationTypeInfo } from '@holi/core/helpers/getLocationTypeInfo'

interface VolunteeringRecoCardWithStatusProps {
  engagement: NormalizedCommittedVolunteeringItem
  fixedWidth?: DimensionValue
  trackingEvent?: TrackingEvent
}
export const VolunteeringRecoCardWithStatus = ({
  engagement,
  fixedWidth,
  trackingEvent,
}: VolunteeringRecoCardWithStatusProps) => {
  const { t } = useTranslation()
  const { isRemote, isHybrid } = getLocationTypeInfo(engagement.locationType, engagement.location)

  const { getVolunteeringStatus } = useMyVolunteeringStatuses()
  const link = `/volunteering/${engagement.externalVolunteeringOpportunityId}`
  const linkLabel = engagement?.organizerName
    ? t('volunteering.engagement.title', {
        title: engagement.title,
        organization: engagement.organizerName,
        interpolation: { escapeValue: false },
      })
    : (engagement.title ?? '')

  const statusChip = getVolunteeringStatus(engagement.status)

  return (
    <HoliLinkTracked
      href={link}
      label={linkLabel}
      trackingEvent={trackingEvent ?? TrackingEvent.MyVolunteering.pressed(engagement.id)}
      isFullHeight={!!fixedWidth}
      testID="volunteering-reco-card-with-status"
    >
      <CompactCard
        title={engagement.title}
        subtitle={
          engagement.organizerName
            ? t('volunteering.engagement.organization', {
                organization: engagement.organizerName,
                interpolation: { escapeValue: false },
              })
            : ''
        }
        imageSrc={engagement.imageUrl}
        avatar={
          engagement.organizerName
            ? {
                label: engagement.organizerName,
                initials: getInitials(engagement.organizerName),
              }
            : undefined
        }
        topLabelIcon={isRemote || isHybrid ? Global : engagement.location ? MapPin2Filled : undefined}
        topLabel={isRemote ? t('task.locationType.REMOTE') : engagement.location}
        fixedWidth={fixedWidth}
        fullHeight={!!fixedWidth}
        imageLabel={t('volunteering.engagement.thumbnail.label')}
        fallbackImageHashKey={engagement.id}
      >
        {statusChip?.chip ? <CompactCard.FooterChips chips={[statusChip.chip]} /> : null}
      </CompactCard>
    </HoliLinkTracked>
  )
}
