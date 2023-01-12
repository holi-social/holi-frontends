import { useQuery } from '@apollo/client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, ViewStyle } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import AppUpdatesList from '@holi/core/screens/homeFeed/components/AppUpdatesList'

import DonationUpdatesItem from '@holi-apps/donations/components/DonationUpdatesItem'
import { AppDonationsProjectsResponse, projectsQuery } from '@holi-apps/donations/queries'
import { Project } from '@holi-apps/donations/typings'

const PROJECT_PAGE_SIZE = 5

type DonationUpdatesProps = {
  locationQuery?: string
  style?: StyleProp<ViewStyle>
}

const DonationUpdates: React.VFC<DonationUpdatesProps> = ({ locationQuery, style }: DonationUpdatesProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()

  const { data, error, loading } = useQuery<AppDonationsProjectsResponse>(projectsQuery, {
    variables: {
      limit: PROJECT_PAGE_SIZE,
      offset: 0,
      location: locationQuery,
    },
    fetchPolicy: 'cache-and-network',
  })

  if (error) {
    logError(error, t('donations:donationListing.error'))
  }

  const { data: projects = [] } = data?.appDonations_projects || {}

  const projectsToRender = projects.slice(0, PROJECT_PAGE_SIZE)

  const renderItem = ({ item, index }: { item: Project; index: number }) => {
    return <DonationUpdatesItem key={index} project={item} />
  }

  return (
    <AppUpdatesList
      appName="donations"
      renderItem={renderItem}
      data={projectsToRender}
      heading={t('donations:app.name')}
      headingIcon="hand-heart"
      onPressSeeMore={() => navigate('/apps/donations/')}
      labelSeeMore={t('donations:donationListing.loadMoreButton.text')}
      loading={loading}
      style={style}
    />
  )
}
export default DonationUpdates
