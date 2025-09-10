import { type QueryHookOptions, useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import RecoSlider from '@holi/core/components/RecoSlider'
import { logError } from '@holi/core/errors/helpers'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import { TrackingEvent } from '@holi/core/tracking'
import type { ListItemIdentifier, ListItemTrackingEvent } from '@holi/core/tracking/TrackableFlatList.shared'
import { CoinsFill } from '@holi/icons/src/generated'

import { type AppDonationsProjectsResponse, donationProjectsQuery } from '@holi-apps/donations/queries'
import type { Project } from '@holi-apps/donations/typings'
import { DonationCard } from '@holi-apps/donations/components/DonationCard'

export const PROJECT_PAGE_SIZE = 5

interface DonationCarouselProps {
  locationQuery?: string
  cardWidth: number
}

// TODO(SF) next
const DonationCarousel = ({ locationQuery, cardWidth }: DonationCarouselProps) => {
  const { t } = useTranslation()

  const queryOptions: QueryHookOptions = {
    variables: {
      limit: PROJECT_PAGE_SIZE,
      offset: 0,
      location: locationQuery,
    },
    onError: (error) =>
      logError(error, 'Failed to load donation projects', {
        location: 'DonationCarousel.projectsQuery',
      }),
  }
  const { data, loading, refetch } = useQuery<AppDonationsProjectsResponse>(donationProjectsQuery, queryOptions)
  useOnRefresh(refetch)

  const { data: projects = [] } = data?.appDonations_projects || {}

  const projectsToRender = projects.slice(0, PROJECT_PAGE_SIZE)

  const listItemTrackingEvent: ListItemTrackingEvent<Project> = ({ title, id }) => {
    return TrackingEvent.RecommendationViewed('donation', {
      title,
      id,
      sourceSection: 'Donations',
    })
  }

  const listItemIdentifier: ListItemIdentifier<Project> = ({ id }) => {
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
      loading={loading}
    />
  )
}

export default withProfiler(DonationCarousel, { name: 'DonationCarousel' })
