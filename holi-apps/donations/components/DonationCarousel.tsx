import { withProfiler } from '@sentry/react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import RecoSlider from '@holi/core/components/RecoSlider'
import { logError } from '@holi/core/errors/helpers'
import { TrackingEvent } from '@holi/core/tracking'
import type { ListItemIdentifier, ListItemTrackingEvent } from '@holi/core/tracking/TrackableFlatList.shared'
import { CoinsFill } from '@holi/icons/src/generated'

import { DonationCard } from '@holi-apps/donations/components/DonationCard'
import { usePaginatedDonations } from '@holi-apps/donations/hooks/usePaginatedDonations'
import type { LocalizedTypesenseDocument } from '@holi/core/typesense/types'

export const PROJECT_PAGE_SIZE = 5

interface DonationCarouselProps {
  cardWidth: number
}

const DonationCarousel = ({ cardWidth }: DonationCarouselProps) => {
  const { t } = useTranslation()

  const { isLoading, projects } = usePaginatedDonations({
    pageSize: PROJECT_PAGE_SIZE,
    onError: (error) =>
      logError(error, 'Failed to load donation projects', {
        location: 'DonationCarousel.usePaginatedDonations',
      }),
  })

  const projectsToRender = projects.slice(0, PROJECT_PAGE_SIZE)

  const listItemTrackingEvent: ListItemTrackingEvent<LocalizedTypesenseDocument> = ({ title, id }) => {
    return TrackingEvent.RecommendationViewed('donation', {
      title,
      id,
      sourceSection: 'Donations',
    })
  }

  const listItemIdentifier: ListItemIdentifier<LocalizedTypesenseDocument> = ({ id }) => {
    return id
  }

  return (
    <RecoSlider
      name="donations"
      viewTrackingParams={{
        listItemTrackingEvent,
        listItemIdentifier,
      }}
      renderItem={(info) => <DonationCard project={info.item} index={info.index} fixedWidth={cardWidth} />}
      data={projectsToRender}
      icon={CoinsFill}
      heading={t('donations.app.name')}
      subline={t('donations.app.subline')}
      seeAllPath="/donations"
      labelSeeMore={t('donations.donationListing.loadMoreButton.text')}
      loading={isLoading}
    />
  )
}

export default withProfiler(DonationCarousel, { name: 'DonationCarousel' })
