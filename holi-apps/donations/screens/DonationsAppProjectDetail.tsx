import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Platform, StyleSheet, View } from 'react-native'

import HoliHead from '@holi/core/components/HoliHead'
import { ButtonTracked } from '@holi/core/components/Trackable'
import { isNotFoundError } from '@holi/core/errors/helpers'
import { useErrorHandling } from '@holi/core/errors/hooks'
import PosthogFeatureFlagGuard from '@holi/core/featureFlags/components/PosthogFeatureFlagGuard'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import { TrackingEvent } from '@holi/core/tracking'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Globe, ShareBox } from '@holi/icons/src/generated'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import { useWindowDimensionsWithImageScaling } from '@holi/ui/components/atoms/HoliImage/useWindowDimensionsWithImageScaling'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import HoliReadMore from '@holi/ui/components/molecules/HoliReadMore'
import { constants, dimensions } from '@holi/ui/styles/globalVars'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import DonationImage from '@holi-apps/donations/components/DonationImage'
import DonationInitiativeButton from '@holi-apps/donations/components/DonationInitiativeButton'
import DonationNews from '@holi-apps/donations/components/DonationNews'
import DonationProgress from '@holi-apps/donations/components/DonationProgress'
import { type AppDonationsProjectByIdResponse, donationProjectByIdQuery } from '@holi-apps/donations/queries'
import { ScrollViewRefreshable } from '@holi/core/helpers/withRefreshControl'

export type DonationsAppProjectDetailParams = {
  projectId: string
}

const UTM_PARAMS = '?utm_source=holi&utm_medium=detailpage&utm_campaign=holi'

const { useParam } = createParamHooks<DonationsAppProjectDetailParams>()

const DonationsAppProjectDetail = () => {
  const projectId = useParam('projectId')
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const statusBarHeight = constants.statusBarHeight
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(statusBarHeight, theme), [statusBarHeight, theme])
  const { replaceRoute } = useRouting()
  const setScreenOptions = useSetScreenOptions()

  const mixins = useStyleMixins()

  const { windowHeight, imageWidth } = useWindowDimensionsWithImageScaling()

  const { loading, data, refetch } = useQuery<AppDonationsProjectByIdResponse>(donationProjectByIdQuery, {
    variables: {
      id: Number(projectId),
    },
    skip: !projectId,
    onError: (error) => {
      if (isNotFoundError(error)) {
        return replaceRoute('/404')
      }
      displayError(error, 'Failed to load donation project', {
        displayMessage: t('donations:donationListing.error'),
        location: 'DonationsAppProjectDetail.projectByIdQuery',
        projectId,
      })
    },
  })
  useOnRefresh(refetch)

  const project = data?.appDonations_project

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({ title: t('donations:app.name') })
  }, [setScreenOptions, t])

  if (!projectId || loading || !project) {
    return <HoliLoader />
  }

  return (
    <>
      <HoliHead
        title={project.title}
        description={project.summary}
        ogTitle={project.title}
        ogDescription={project.summary}
        ogImage={project.picture.length ? project.picture[0].url : undefined}
      />
      <View
        style={{ alignItems: 'center', flex: 1, backgroundColor: colors.background30 }}
        testID="donations-detailview-container"
      >
        <ScrollViewRefreshable style={{ backgroundColor: colors.background30 }}>
          <View style={[mixins.container, styles.container, { minHeight: windowHeight }]}>
            <DonationImage picture={project.picture} label={project.title} style={styles.image} width={imageWidth} />
            <View style={styles.header}>
              <HoliHeading level="1" size="l" testID="donations-project-title">
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
              progressPercentage={project.progressPercentage}
              openAmountInCents={project.openAmountInCents}
              size="large"
              style={styles.card}
              testID="donations-project-progress"
            />
            <View style={[styles.card, { paddingVertical: 24 }]} testID="donations-project-description">
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
        </ScrollViewRefreshable>

        <View style={[mixins.container, styles.donateButtonContainer]}>
          <HoliLink
            label={t('donations:projectDetail.donate')}
            href={`${project.donationUrl}${UTM_PARAMS}`}
            testID="donations-project-detail-donate-btn"
            external
          >
            <ButtonTracked
              label={t('donations:projectDetail.donate')}
              onPress={() => Linking.openURL(`${project?.donationUrl}${UTM_PARAMS}`)}
              trackingEvent={TrackingEvent.Donations.pressed(project.id)}
              icon={ShareBox}
            />
          </HoliLink>
        </View>
      </View>
    </>
  )
}

const WrappedDonationsAppProjectDetail = () => (
  <PosthogFeatureFlagGuard featureFlagKey={FeatureFlagKey.DONATIONS} i18nKey="donations:maintenance.feature">
    <DonationsAppProjectDetail />
  </PosthogFeatureFlagGuard>
)

export default withProfiler(memo(WrappedDonationsAppProjectDetail), { name: 'DonationsAppProjectDetail' })

const getStyles = (statusBarHeight: number, theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      paddingBottom: 132,
      paddingHorizontal: 0,
      ...Platform.select({
        native: {
          maxWidth: '100%',
        },
      }),
    },
    donateButtonContainer: {
      bottom: 40,
      justifyContent: 'center',
      alignItems: 'stretch',
      paddingHorizontal: 16,
      width: '100%',
      maxWidth: dimensions.maxButtonWidth,
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
      backgroundColor: theme.colors.background10,
    },
    location: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 14,
    },
    card: {
      paddingHorizontal: 24,
      borderRadius: 32,
      backgroundColor: theme.colors.background10,
      marginTop: 2,
      paddingVertical: 16,
    },
  })
