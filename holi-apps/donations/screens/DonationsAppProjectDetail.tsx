import { useQuery } from '@apollo/client'
import Constants from 'expo-constants'
import React, { memo, useEffect, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import DefaultLayout from '@holi/core/DefaultLayout'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useOnRefresh } from '@holi/core/helpers/useOnRefresh'
import createParam from '@holi/core/navigation/hooks/useParam'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import HoliReadMore from '@holi/ui/components/molecules/HoliReadMore'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import DonationImage from '@holi-apps/donations/components/DonationImage'
import DonationInitiativeButton from '@holi-apps/donations/components/DonationInitiativeButton'
import DonationNews from '@holi-apps/donations/components/DonationNews'
import DonationProgress from '@holi-apps/donations/components/DonationProgress'
import { AppDonationsProjectByIdResponse, projectByIdQuery } from '@holi-apps/donations/queries'

export type DonationsAppProjectDetailParams = {
  projectId: string
}

const { useParam } = createParam<DonationsAppProjectDetailParams>()

const DonationsAppProjectDetail = () => {
  const [projectId] = useParam('projectId')
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const statusBarHeight = Constants.statusBarHeight
  const styles = getStyles(statusBarHeight)
  const setScreenOptions = useSetScreenOptions()

  const mixins = useStyleMixins()

  const { height: deviceHeight } = useWindowDimensions()

  const { loading, data, error, refetch } = useQuery<AppDonationsProjectByIdResponse>(projectByIdQuery, {
    variables: {
      id: Number(projectId),
    },
    skip: !projectId,
  })
  const { refreshing, onRefresh } = useOnRefresh(refetch)

  const project = data?.appDonations_project

  useLayoutEffect(() => {
    setScreenOptions({ title: t('donations:app.name') })
  }, [setScreenOptions, t])

  useEffect(() => {
    if (error) {
      displayError(error, t('donations:donationListing.error'))
    }
  }, [error, displayError, t])

  if (!projectId || loading) {
    // TODO: replace with proper loading indicator
    return (
      <DefaultLayout>
        <View style={[mixins.container, styles.messageContainer]}>
          <HoliText>{t('donations:donationListing.loading')}</HoliText>
        </View>
      </DefaultLayout>
    )
  }

  if (!project) {
    return (
      <DefaultLayout>
        <View style={[mixins.container, styles.messageContainer]}>
          <HoliText>{t('donations:projectDetail.notFound', { projectId })}</HoliText>
        </View>
      </DefaultLayout>
    )
  }

  return (
    <View
      style={{ alignItems: 'center', flex: 1, backgroundColor: colors.background30 }}
      testID="donations-detailview-container"
    >
      <ScrollHeaderLayout.Refreshable
        refreshableProps={{ isLoading: refreshing, onRefresh }}
        style={{ backgroundColor: colors.background30 }}
        headerOverlap
      >
        <View style={[mixins.container, styles.container, { minHeight: deviceHeight }]}>
          <DonationImage picture={project.picture} label={project.title} style={styles.image} />
          <View style={styles.header}>
            <HoliHeading level="1" size={'large'}>
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
      </ScrollHeaderLayout.Refreshable>

      <View style={[mixins.container, styles.donateButton]}>
        <HoliButtonLoading
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

const getStyles = (statusBarHeight: number) =>
  StyleSheet.create({
    messageContainer: {
      alignItems: 'center',
      marginTop: vars.topBarHeight + 50,
    },
    container: {
      paddingBottom: 132,
      paddingHorizontal: 0,
      ...Platform.select({
        native: {
          maxWidth: '100%',
          paddingTop: vars.topBarHeight + 40,
        },
        web: {
          paddingTop: statusBarHeight + vars.topBarHeight,
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
