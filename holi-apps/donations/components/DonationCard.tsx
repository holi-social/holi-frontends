import React, { useMemo } from 'react'
import type { DimensionValue } from 'react-native'
import { useTranslation } from 'react-i18next'
import { CompactCard } from 'holi-bricks/components/compactCard'
import { HoliLinkTracked } from '@holi/core/components/Trackable'
import { TrackingEvent } from '@holi/core/tracking'
import type { LocalizedTypesenseDocument } from '@holi/core/typesense/types'

interface DonationCardProps {
  project: LocalizedTypesenseDocument
  index: number
  fixedWidth?: DimensionValue
}

export const DonationCard = ({ project, index, fixedWidth }: DonationCardProps) => {
  const { i18n, t } = useTranslation()
  const linkLabel = project.organizer_name
    ? t('donations.project.title', {
        title: project.title,
        initiative: project.organizer_name,
        interpolation: { escapeValue: false },
      })
    : project.title
  const openAmount = useMemo(
    () =>
      new Intl.NumberFormat(i18n.language, {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
      }).format(Math.round((project.donation_open_amount_in_cents ?? 0) / 100)),
    [project.donation_open_amount_in_cents, i18n.language]
  )

  return (
    <HoliLinkTracked
      href={`/donations/${project.link_locators?.donation}`}
      label={linkLabel}
      testID="donations-list-item"
      trackingEvent={TrackingEvent.RecommendationPressed(
        'donation',
        project.link_locators?.donation?.toString() ?? project.id,
        index,
        {
          sourceSection: 'Donations',
        }
      )}
      isFullHeight={!!fixedWidth}
    >
      <CompactCard
        title={project.title}
        subtitle={
          project.organizer_name ? t('donations.project.initiative', { initiative: project.organizer_name }) : ''
        }
        imageSrc={project.image_url}
        imageLabel={t('donations.project.thumbnail.label')}
        fixedWidth={fixedWidth}
        fullHeight={!!fixedWidth}
        fallbackImageHashKey={project.id.toString()}
      >
        <CompactCard.FooterProgressBar
          progressBarLeft={t('donations.donationProgress.percentFunded', {
            percentage: project.donation_progress_percentage,
          })}
          progressBarRight={t('donations.donationProgress.openAmount', { amount: openAmount })}
          progressBarPercentage={project.donation_progress_percentage ?? 0}
        />
      </CompactCard>
    </HoliLinkTracked>
  )
}
