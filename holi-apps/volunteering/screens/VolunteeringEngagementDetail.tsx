import { useLazyQuery, useMutation } from '@apollo/client'
import Constants from 'expo-constants'
import React, { memo, useEffect, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Platform, StyleSheet, View, useWindowDimensions } from 'react-native'
import RenderHtml from 'react-native-render-html'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { logError } from '@holi/core/errors/helpers'
import { useErrorHandling } from '@holi/core/errors/hooks'
import createParam from '@holi/core/navigation/hooks/useParam'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import type { VolunteeringAppScreensList } from '@holi/mobile/navigation/VolunteeringAppNavigator'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import VolunteeringDetailHeader from '@holi-apps/volunteering/components/VolunteeringDetailHeader'
import {
  AppVolunteeringEngagementByIdResponse,
  TrackEngagementViewResponse,
  engagementByIdQuery,
  trackEngagementViewMutation,
} from '@holi-apps/volunteering/queries'
import { Organizer } from '@holi-apps/volunteering/types'

export type VolunteeringEngagementDetailParams = {
  engagementId: string
}
const { useParam } = createParam<VolunteeringEngagementDetailParams>()

type VolunteeringEngagementDetailProps = NativeStackScreenProps<VolunteeringAppScreensList>
type AboutVolunteeringProps = { description: string; organizer?: Organizer }

const AKTION_MENSCH_URL = 'https://www.aktion-mensch.de/ueber-uns/die-aktion-mensch'
const VOSTEL_URL = 'https://vostel.de/de/ueber_vostel'

const VolunteeringEngagementDetail: React.VFC<VolunteeringEngagementDetailProps> = () => {
  const [engagementId] = useParam('engagementId')
  const { t } = useTranslation()
  const { setOptions } = useUnifiedNavigation()
  useLayoutEffect(() => setOptions({ title: t('volunteering:app.name') }), [setOptions, t])
  const mixins = useStyleMixins()
  const { displayError } = useErrorHandling()

  const [fetchEngagementById, { loading, data, error }] =
    useLazyQuery<AppVolunteeringEngagementByIdResponse>(engagementByIdQuery)
  const [trackEngagementView] = useMutation<TrackEngagementViewResponse>(trackEngagementViewMutation)
  const engagement = data?.appVolunteering_engagement
  const { height: deviceHeight, width: deviceWidth } = useWindowDimensions()
  const statusBarHeight = Constants.statusBarHeight
  const styles = getStyles(statusBarHeight)

  useLayoutEffect(() => {
    if (engagementId && !loading && !engagement) {
      fetchEngagementById({
        variables: {
          id: engagementId,
        },
      })
    }
  }, [fetchEngagementById, engagementId, loading, engagement])

  useEffect(() => {
    if (engagementId) {
      trackEngagementView({ variables: { id: engagementId } }).catch((error) => {
        logError(error, `[VolunteeringEngagementDetail.tsx] Error tracking view for ${engagementId}: ${error.message}`)
      })
    }
  }, [trackEngagementView, engagementId])

  // TODO: replace with proper loading indicator
  if (!engagementId || loading) {
    return (
      <DefaultLayout>
        <View style={[mixins.container, styles.messageContainer]}>
          <HoliText>{t('volunteering:listing.loading')}</HoliText>
        </View>
      </DefaultLayout>
    )
  }
  if (error) {
    displayError(error, t('volunteering:listing.error'))
  }

  if (!engagement) {
    return <HoliText>{t('volunteering:engagementDetail.notFound', { engagementId })}</HoliText>
  }

  const ProviderContainer = ({ source }: { source: string; url: string }) => {
    return (
      <View style={styles.cardContainer}>
        <HoliText size="large">{t('volunteering:engagementDetail.provider')}</HoliText>
        <HoliButton
          transparent
          onPress={() => Linking.openURL(engagement.url)}
          label={t('volunteering:engagementDetail.provider.link.btn', { source })}
        >
          <View style={styles.providerInfoRow}>
            <HoliLocalImage
              imageSource={
                engagement.source === 'Aktion Mensch'
                  ? require('@holi/ui/assets/img/volunteering/aktion-mensch-logo.svg')
                  : require('@holi/ui/assets/img/volunteering/vostel-logo.png')
              }
              isSvg={engagement.source === 'Aktion Mensch' ? true : false}
              width={40}
              height={40}
              style={styles.providerImage}
              label={t('volunteering:engagementDetail.provider')}
              resizeMode="contain"
            />
            <View style={{ flex: 3 }}>
              <HoliText>{source}</HoliText>
            </View>
            <HoliIcon icon="share-box" size={15} color={colors.foreground30} />
          </View>
        </HoliButton>
      </View>
    )
  }

  const Organizer = ({ organizer: organizer }: { organizer: Organizer }) => {
    return (
      <View style={{ marginTop: 10 }}>
        <HoliText size={'large'}>{t('volunteering:engagementDetail.organizer')}</HoliText>
        <View style={styles.organizerInfoRow}>
          {(!!organizer.imageUrl && (
            <HoliImage source={{ uri: organizer.imageUrl }} style={styles.organizerLogo} label={organizer.name ?? ''} />
          )) || <></>}
          <HoliText>{organizer.name}</HoliText>
        </View>
      </View>
    )
  }

  const AboutVolunteering = ({ description, organizer }: AboutVolunteeringProps) => {
    return (
      <View style={[styles.cardContainer, { maxWidth: deviceWidth }]}>
        <HoliText size={'large'}>{t('volunteering:engagementDetail.aboutEngagement')}</HoliText>
        <RenderHtml source={{ html: `${description}` }} contentWidth={deviceWidth} />
        {organizer && <Organizer organizer={organizer} />}
      </View>
    )
  }

  return (
    <View style={styles.container} testID="volunteering-detailview-container">
      <ScrollHeaderLayout.Defatult style={{ backgroundColor: colors.background30 }} headerOverlap>
        {engagement && (
          <View style={[mixins.container, styles.wrapper, { minHeight: deviceHeight, maxWidth: deviceWidth }]}>
            <VolunteeringDetailHeader engagement={engagement} />
            <AboutVolunteering description={engagement.description} organizer={engagement.organizer} />
            {(engagement.source === 'Aktion Mensch' || engagement.source === 'vostel.de') && (
              <ProviderContainer
                source={engagement.source}
                url={engagement.source === 'Aktion Mensch' ? AKTION_MENSCH_URL : VOSTEL_URL}
              />
            )}
          </View>
        )}
      </ScrollHeaderLayout.Defatult>

      <View style={[mixins.container, styles.volunteeringButton]}>
        <HoliButtonLoading
          icon="share-box"
          label={t('volunteering:engagementDetail.getInTouch')}
          onPress={() => Linking.openURL(engagement.url)}
          testID="volunteering-engagement-get-in-touch-btn"
        />
      </View>
    </View>
  )
}

export default memo(VolunteeringEngagementDetail)

const getStyles = (statusBarHeight: number) =>
  StyleSheet.create({
    messageContainer: {
      alignItems: 'center',
      marginTop: vars.topBarHeight + 50,
    },
    container: {
      alignItems: 'center',
      flex: 1,
      backgroundColor: colors.background30,
    },
    wrapper: {
      paddingBottom: 132,
      paddingHorizontal: 0,
      ...Platform.select({
        native: {
          maxWidth: '100%',
          paddingTop: vars.topBarHeight + 40,
        },
        web: {
          paddingTop: vars.topBarHeight + statusBarHeight,
        },
      }),
    },
    cardContainer: {
      width: '100%',
      backgroundColor: 'white',
      borderRadius: 32,
      padding: 24,
      marginTop: 2,
    },
    organizerInfoRow: {
      display: 'flex',
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 16,
    },
    organizerLogo: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 16,
    },
    providerImage: {
      marginRight: 16,
    },
    providerInfoRow: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 16,
    },

    volunteeringButton: {
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
  })
