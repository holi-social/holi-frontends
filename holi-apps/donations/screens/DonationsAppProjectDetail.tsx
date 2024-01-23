import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import Constants from 'expo-constants'
import React, { memo, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Platform, StyleSheet, View } from 'react-native'

import FeatureToggleGuard from '@holi/core/components/FeatureToggleGuard'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { FeatureToggleName } from '@holi/core/helpers/useFeatureToggle'
import { useOnRefresh } from '@holi/core/helpers/useOnRefresh'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Globe, ShareBox } from '@holi/icons/src/generated'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import { useWindowDimensionsWithImageScaling } from '@holi/ui/components/atoms/HoliImage/useWindowDimensionsWithImageScaling'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import HoliReadMore from '@holi/ui/components/molecules/HoliReadMore'
import { colors, dimensions } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import DonationImage from '@holi-apps/donations/components/DonationImage'
import DonationInitiativeButton from '@holi-apps/donations/components/DonationInitiativeButton'
import DonationNews from '@holi-apps/donations/components/DonationNews'
import DonationProgress from '@holi-apps/donations/components/DonationProgress'
import { AppDonationsProjectByIdResponse, donationProjectByIdQuery } from '@holi-apps/donations/queries'

export type DonationsAppProjectDetailParams = {
  projectId: string
}

const { useParam } = createParamHooks<DonationsAppProjectDetailParams>()

const DonationsAppProjectDetail = () => {
  const [projectId] = useParam('projectId')
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const statusBarHeight = Constants.statusBarHeight
  const styles = getStyles(statusBarHeight)
  const { replaceRoute } = useRouting()
  const setScreenOptions = useSetScreenOptions()

  const mixins = useStyleMixins()

  const { windowHeight, imageWidth } = useWindowDimensionsWithImageScaling()

  const { loading, data, refetch } = useQuery<AppDonationsProjectByIdResponse>(donationProjectByIdQuery, {
    variables: {
      id: Number(projectId),
    },
    skip: !projectId,
    onError: (error) =>
      displayError(error, 'Failed to load donation project', {
        displayMessage: t('donations:donationListing.error'),
        location: 'DonationsAppProjectDetail.projectByIdQuery',
        projectId,
      }),
  })
  const { refreshing, onRefresh } = useOnRefresh(refetch)

  const project = data?.appDonations_project

  useLayoutEffect(() => {
    setScreenOptions({ title: t('donations:app.name') })
  }, [setScreenOptions, t])

  if (!projectId || loading) {
    return <HoliLoader />
  }

  if (!project) {
    replaceRoute('/404')
    return <></>
  }

  return (
    <View
      style={{ alignItems: 'center', flex: 1, backgroundColor: colors.background30 }}
      testID="donations-detailview-container"
    >
      <ScrollHeaderLayout.Refreshable
        refreshableProps={{ refreshing, onRefresh }}
        style={{ backgroundColor: colors.background30 }}
        headerOverlap
      >
        <View style={[mixins.container, styles.container, { minHeight: windowHeight }]}>
          <DonationImage picture={project.picture} label={project.title} style={styles.image} width={imageWidth} />
          <View style={styles.header}>
            <HoliHeading level="1" size={'large'}>
              {project.title}
            </HoliHeading>
            <View style={styles.location}>
              <HoliIcon icon={Globe} size={20} />
              <HoliText size="small" style={{ marginLeft: 8 }}>
                {project.initiative.city}, {project.initiative.country}
              </HoliText>
            </View>
          </View>
          <DonationProgress
            donationsCount={project.donationsCount}
            progressPercentage={project.progressPercentage}
            openAmountInCents={project.openAmountInCents}
            size="large"
            style={styles.card}
          />
          <View style={[styles.card, { paddingVertical: 24 }]}>
            <DonationInitiativeButton initiative={project.initiative} />
            <HoliText size={'large'} style={{ marginVertical: 24 }}>
              &ldquo;{project.summary}&rdquo;
            </HoliText>
            <HoliReadMore numberOfLines={5}>{project.description}</HoliReadMore>
          </View>
          {project?.news.length > 0 && (
            <DonationNews
              totalEntries={project.newsCount}
              news={project.news}
              style={[styles.card, { paddingVertical: 24 }]}
            />
          )}
        </View>
      </ScrollHeaderLayout.Refreshable>

      <View style={[mixins.container, styles.donateButton]}>
        <HoliButtonLoading
          icon={ShareBox}
          label={t('donations:projectDetail.donate')}
          onPress={() => Linking.openURL(project.donationUrl)}
          testID="donations-project-detail-donate-btn"
        />
      </View>
    </View>
  )
}

const WrappedDonationsAppProjectDetail = () => (
  <FeatureToggleGuard toggleName={FeatureToggleName.APPS_DONATIONS} featureNameKey="donations:maintenance.feature">
    <DonationsAppProjectDetail />
  </FeatureToggleGuard>
)

export default withProfiler(memo(WrappedDonationsAppProjectDetail), { name: 'DonationsAppProjectDetail' })

const getStyles = (statusBarHeight: number) =>
  StyleSheet.create({
    messageContainer: {
      alignItems: 'center',
      marginTop: dimensions.topBarHeight + 50,
    },
    container: {
      paddingBottom: 132,
      paddingHorizontal: 0,
      ...Platform.select({
        native: {
          maxWidth: '100%',
          paddingTop: dimensions.topBarHeight + 40,
        },
        web: {
          paddingTop: statusBarHeight + dimensions.topBarHeight,
        },
      }),
    },
    donateButton: {
      bottom: 40,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 16,
      ...Platform.select({
        native: {
          position: 'absolute',
        },
        default: {
          position: 'fixed',
        },
      }),
    },
    image: {
      // image with is determined by the window with, source material is 2:1
      // if we use lower pixel ratios than 2, we would zoom in into the image and cause blurriness
      aspectRatio: 2,
      width: '100%',
    },
    header: {
      paddingHorizontal: 24,
      paddingTop: 40,
      paddingBottom: 24,
      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,
      backgroundColor: colors.background10,
    },
    location: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 14,
    },
    card: {
      paddingHorizontal: 24,
      borderRadius: 32,
      backgroundColor: colors.background10,
      marginTop: 2,
      paddingVertical: 16,
    },
  })
