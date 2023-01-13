import { useQuery } from '@apollo/client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, ViewStyle } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import AppUpdatesItem from '@holi/core/screens/homeFeed/components/AppUpdatesItem'
import AppUpdatesList from '@holi/core/screens/homeFeed/components/AppUpdatesList'
import { ImageSource } from '@holi/ui/components/atoms/HoliImage.shared'

import DonationProgress from '@holi-apps/donations/components/DonationProgress'
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

  const renderItem = ({ item }: { item: Project }) => {
    const { categories, donationsCount, progressPercentage, openAmountInCents, picture } = item
    const sources: ImageSource[] = picture
      .filter((picture) => !!picture.width && !!picture.height)
      .map((picture) => ({
        uri: picture.url,
        width: picture.width || 0,
        height: picture.height || 0,
      }))
    const original = picture.find(({ type }) => type === 'original')

    return (
      <AppUpdatesItem
        appName="donations"
        onPress={() => navigate(`/apps/donations/project/${item.id}`)}
        title={item.title}
        imageSource={sources.length ? sources : { uri: original?.url }}
        footer={
          <DonationProgress
            category={categories[0]}
            donationsCount={donationsCount}
            progressPercentage={progressPercentage}
            openAmountInCents={openAmountInCents}
            size={'small'}
          />
        }
      />
    )
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
