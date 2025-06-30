import React, { useMemo } from 'react'
import type { DimensionValue } from 'react-native'
import type { Project } from '@holi-apps/donations/typings'
import { useTranslation } from 'react-i18next'
import { CompactCard } from 'holi-bricks/components/compactCard'
import { HoliLinkTracked } from '@holi/core/components/Trackable'
import { TrackingEvent } from '@holi/core/tracking'

interface DonationCardProps {
  project: Project
  index: number
  fixedWidth?: DimensionValue
}

export const DonationCard = ({ project, index, fixedWidth }: DonationCardProps) => {
  const { i18n, t } = useTranslation()
  const linkLabel = project.initiative?.name
    ? t('donations.project.title', {
        title: project.title,
        initiative: project.initiative.name,
        interpolation: { escapeValue: false },
      })
    : project.title
  // we can't crop + fill mismatching required width+height combinations to the source images with the betterplace api,
  // so we use the original on our image service
  const image = project.picture.find(({ type }) => type === 'original')
  const openAmount = useMemo(
    () =>
      new Intl.NumberFormat(i18n.language, {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
      }).format(Math.round(project.openAmountInCents / 100)),
    [project.openAmountInCents, i18n.language]
  )

  return (
    <HoliLinkTracked
      href={`/donations/${project.id}`}
      label={linkLabel}
      testID="donations-list-item"
      trackingEvent={TrackingEvent.RecommendationPressed('donation', project.id.toString(), index)}
      isFullHeight={!!fixedWidth}
    >
      <CompactCard
        title={project.title}
        subtitle={
          project.initiative?.name ? t('donations.project.initiative', { initiative: project.initiative.name }) : ''
        }
        imageSrc={image?.url}
        imageLabel={t('donations.project.thumbnail.label')}
        fixedWidth={fixedWidth}
        fullHeight={!!fixedWidth}
        fallbackImageHashKey={project.id.toString()}
      >
        <CompactCard.FooterProgressBar
          progressBarLeft={t('donations.donationProgress.percentFunded', { percentage: project.progressPercentage })}
          progressBarRight={t('donations.donationProgress.openAmount', { amount: openAmount })}
          progressBarPercentage={project.progressPercentage}
        />
      </CompactCard>
    </HoliLinkTracked>
  )
}
