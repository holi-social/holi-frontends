import { useLazyQuery } from '@apollo/client'
import React, { memo, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import { displayError } from '@holi/core/errors/helpers'
import { useScrollYHandler } from '@holi/core/helpers'
import createParam from '@holi/core/navigation/hooks/useParam'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import type { BottomTabsScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliReadMore from '@holi/ui/components/molecules/HoliReadMore'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import DonationButton from '@holi-apps/donations/components/DonationButton'
import DonationImage from '@holi-apps/donations/components/DonationImage'
import DonationInitiativeButton from '@holi-apps/donations/components/DonationInitiativeButton'
import DonationNews from '@holi-apps/donations/components/DonationNews'
import DonationProgress from '@holi-apps/donations/components/DonationProgress'
import { AppDonationsProjectByIdResponse, projectByIdQuery } from '@holi-apps/donations/queries'

export type DonationsAppProjectDetailParams = {
  projectId: string
}

const { useParam } = createParam<DonationsAppProjectDetailParams>()

type DonationsAppProjectDetailProps = NativeStackScreenProps<BottomTabsScreens>

const DonationsAppProjectDetail: React.VFC<DonationsAppProjectDetailProps> = () => {
  const [projectId] = useParam('projectId')
  const { t, i18n } = useTranslation()
  const { setOptions } = useUnifiedNavigation()
  const onScreenScroll = useScrollYHandler()
  useLayoutEffect(() => setOptions({ title: t('donations:app.name') }), [setOptions, t])

  const mixins = useStyleMixins()

  const { height: deviceHeight } = useWindowDimensions()

  const [fetchProjectById, { loading, data, error }] = useLazyQuery<AppDonationsProjectByIdResponse>(projectByIdQuery)

  const project = data?.appDonations_project

  // TODO: workaround for params always being undefined on initial page load
  // > will probably be solved with ssr
  // see https://github.com/nandorojo/solito/issues/100
  useLayoutEffect(() => {
    if (projectId && !loading && !project) {
      fetchProjectById({
        variables: {
          locale: i18n.language,
          id: Number(projectId),
        },
      })
    }
  }, [fetchProjectById, projectId, loading, project, i18n.language])

  if (!projectId || loading) {
    // TODO: replace with proper loading indicator
    return (
      <View style={[mixins.container, styles.messageContainer]}>
        <HoliText>{t('donations:donationListing.loading')}</HoliText>
      </View>
    )
  }

  if (error) {
    displayError(error, t('donations:donationListing.error'))
  }

  if (!project) {
    return <HoliText>{t('donations:projectDetail.notFound', { projectId })}</HoliText>
  }

  return (
    <View style={{ alignItems: 'center', flex: 1, backgroundColor: colors.backgroundColorGreyLight }}>
      <DefaultLayout
        onScroll={onScreenScroll}
        scrollEventThrottle={200}
        style={{ backgroundColor: colors.backgroundColorGreyLight }}
      >
        <View style={[mixins.container, styles.container, { minHeight: deviceHeight }]}>
          <DonationImage picture={project.picture} label={project.title} style={styles.image} />
          <View style={styles.header}>
            <HoliHeading level="1" size={'large'} testID="donations-project-detail-heading">
              {project.title}
            </HoliHeading>
            <View style={styles.location}>
              <HoliIcon icon="globe" size={20} />
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
      </DefaultLayout>
      <View style={[mixins.container, styles.donateButton]}>
        <DonationButton
          icon="share-box"
          label={t('donations:projectDetail.donate')}
          onPress={() => Linking.openURL(project.donationUrl)}
          testID="donations-project-detail-donate-btn"
        />
      </View>
    </View>
  )
}

export default memo(DonationsAppProjectDetail)

const styles = StyleSheet.create({
  messageContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  container: {
    paddingBottom: 132,
    paddingHorizontal: 0,
    ...Platform.select({
      native: {
        maxWidth: '100%',
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
    aspectRatio: 375 / 240,
    width: '100%',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    backgroundColor: colors.white,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  card: {
    paddingHorizontal: 24,
    borderRadius: 32,
    backgroundColor: colors.white,
    marginTop: 2,
    paddingVertical: 16,
  },
})
