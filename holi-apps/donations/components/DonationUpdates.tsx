import { QueryHookOptions, useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import RecoSlider from '@holi/core/components/RecoSlider'
import RecoSliderCard from '@holi/core/components/RecoSliderCard'
import { logError } from '@holi/core/errors/helpers'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import { TrackingEvent } from '@holi/core/tracking'
import { ListItemIdentifier, ListItemTrackingEvent } from '@holi/core/tracking/TrackableFlatList.shared'
import { HandHeartsFilled } from '@holi/icons/src/generated'

import DonationProgress from '@holi-apps/donations/components/DonationProgress'
import { AppDonationsProjectsResponse, donationProjectsQuery } from '@holi-apps/donations/queries'
import { Project } from '@holi-apps/donations/typings'

export const PROJECT_PAGE_SIZE = 5

interface DonationUpdatesProps {
  locationQuery?: string
  cardWidth: number
}

const DonationUpdates = ({ locationQuery, cardWidth }: DonationUpdatesProps) => {
  const { t } = useTranslation()

  const queryOptions: QueryHookOptions = {
    variables: {
      limit: PROJECT_PAGE_SIZE,
      offset: 0,
      location: locationQuery,
    },
    onError: (error) =>
      logError(error, 'Failed to load donation projects', {
        location: 'DonationUpdates.projectsQuery',
      }),
  }
  const { data, loading, refetch } = useQuery<AppDonationsProjectsResponse>(donationProjectsQuery, queryOptions)
  useOnRefresh(refetch)

  const { data: projects = [] } = data?.appDonations_projects || {}

  const projectsToRender = projects.slice(0, PROJECT_PAGE_SIZE)

  const renderItem = ({ item, index }: { item: Project; index: number }) => {
    const { categories, progressPercentage, openAmountInCents, picture } = item
    // we can't crop + fill mismatching required width+height combinations to the source images with the betterplace api,
    // so we use the original on our image service
    const original = picture.find(({ type }) => type === 'original')

    return (
      <RecoSliderCard
        to={`/donations/${item.id}`}
        name="donations"
        index={index}
        title={item.title}
        imageSourceUri={original?.url}
        footer={
          <DonationProgress
            category={categories[0]}
            progressPercentage={progressPercentage}
            openAmountInCents={openAmountInCents}
            size={'small'}
          />
        }
        trackingEvent={TrackingEvent.RecommendationPressed('donation', `${item.id}`, index)}
        cardWidth={cardWidth}
      />
    )
  }

  const listItemTrackingEvent: ListItemTrackingEvent<Project> = ({ title, id }) => {
    return TrackingEvent.RecommendationViewed('donation', { title, id })
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
      renderItem={renderItem}
      data={projectsToRender}
      icon={HandHeartsFilled}
      heading={t('donations:app.name')}
      subline={t('donations:app.subline')}
      seeAllPath="/donations"
      labelSeeMore={t('donations:donationListing.loadMoreButton.text')}
      loading={loading}
      cardWidth={cardWidth}
    />
  )
}

export default withProfiler(DonationUpdates, { name: 'DonationUpdates' })
