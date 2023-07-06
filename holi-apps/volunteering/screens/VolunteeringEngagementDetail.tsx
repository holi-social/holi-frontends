import { useMutation, useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import Constants from 'expo-constants'
import React, { memo, useEffect, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Platform, StyleSheet, View, useWindowDimensions } from 'react-native'
import RenderHtml from 'react-native-render-html'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/components/DefaultLayout'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { logError } from '@holi/core/errors/helpers'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useOnRefresh } from '@holi/core/helpers/useOnRefresh'
import createParam from '@holi/core/navigation/hooks/useParam'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import type { VolunteeringAppScreensList } from '@holi/mobile/navigation/VolunteeringAppNavigator'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import { StaticImageData } from '@holi/ui/components/atoms/HoliLocalImage.shared'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import VolunteeringDetailHeader from '@holi-apps/volunteering/components/VolunteeringDetailHeader'
import VolunteeringPartnerCard from '@holi-apps/volunteering/components/VolunteeringPartnerCard'
import {
  AppVolunteeringEngagementByIdResponse,
  TrackEngagementViewResponse,
  engagementByIdQuery,
  trackEngagementViewMutation,
} from '@holi-apps/volunteering/queries'
import { Organizer } from '@holi-apps/volunteering/types'

const VOLUNTEERING_IMG_SOURCES_MAPPING: {
  [name: string]: { imgSource: StaticImageData; url: string; isSvg: boolean }
} = {
  Voltastics: {
    imgSource: require('@holi/ui/assets/img/volunteering/voltastics.png'),
    url: 'https://voltastics.com/',
    isSvg: false,
  },
  'Aktion Mensch': {
    imgSource: require('@holi/ui/assets/img/volunteering/aktion-mensch-logo.svg'),
    url: 'https://www.aktion-mensch.de/ueber-uns/die-aktion-mensch',
    isSvg: true,
  },
  'vostel.de': {
    imgSource: require('@holi/ui/assets/img/volunteering/vostel-logo.png'),
    url: 'https://vostel.de/de/ueber_vostel',
    isSvg: false,
  },
  GoNature: {
    imgSource: require('@holi/ui/assets/img/volunteering/gonature-logo.svg'),
    url: 'https://gonature.de/ueber-uns',
    isSvg: true,
  },
  GoVolunteer: {
    imgSource: require('@holi/ui/assets/img/volunteering/govolunteer-logo.svg'),
    url: 'https://govolunteer.com/ueber-uns',
    isSvg: true,
  },
}

export type VolunteeringEngagementDetailParams = {
  engagementId: string
}
const { useParam } = createParam<VolunteeringEngagementDetailParams>()

type VolunteeringEngagementDetailProps = NativeStackScreenProps<VolunteeringAppScreensList>
type AboutVolunteeringProps = { description: string; organizer?: Organizer }

const VolunteeringEngagementDetail: React.VFC<VolunteeringEngagementDetailProps> = () => {
  const [engagementId] = useParam('engagementId')
  const { t } = useTranslation()
  const setScreenOptions = useSetScreenOptions()
  useLayoutEffect(() => {
    setScreenOptions({ title: t('volunteering:app.name') })
  }, [setScreenOptions, t])
  const mixins = useStyleMixins()
  const { displayError } = useErrorHandling()

  const { loading, data, error, refetch } = useQuery<AppVolunteeringEngagementByIdResponse>(engagementByIdQuery, {
    variables: {
      id: engagementId,
    },
    skip: !engagementId,
  })
  const [trackEngagementView] = useMutation<TrackEngagementViewResponse>(trackEngagementViewMutation)
  const engagement = data?.appVolunteering_engagement

  const { refreshing, onRefresh } = useOnRefresh(refetch)

  const { height: deviceHeight, width: deviceWidth } = useWindowDimensions()
  const statusBarHeight = Constants.statusBarHeight
  const styles = getStyles(statusBarHeight)

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

  const partner = VOLUNTEERING_IMG_SOURCES_MAPPING[engagement.source]
  const providerContainer = (
    <VolunteeringPartnerCard
      title={t('volunteering:engagementDetail.provider')}
      name={engagement.source}
      partner={VOLUNTEERING_IMG_SOURCES_MAPPING[engagement.source]}
    />
  )

  const Organizer = ({ organizer: organizer }: { organizer: Organizer }) => {
    return (
      <View style={{ marginTop: 10 }}>
        <HoliText size={'large'}>{t('volunteering:engagementDetail.organizer')}</HoliText>
        <View style={styles.organizerInfoRow}>
          {(!!organizer.imageUrl && (
            <HoliImage
              source={{ uri: organizer.imageUrl }}
              style={styles.partnerImage}
              label={organizer.name ?? ''}
              resizeMode={'contain'}
            />
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
      <ScrollHeaderLayout.Refreshable
        refreshableProps={{ isLoading: refreshing, onRefresh }}
        style={{ backgroundColor: colors.background30 }}
        headerOverlap
      >
        {engagement && (
          <View style={[mixins.container, styles.wrapper, { minHeight: deviceHeight, maxWidth: deviceWidth }]}>
            <VolunteeringDetailHeader engagement={engagement} />
            <AboutVolunteering description={engagement.description} organizer={engagement.organizer} />
            {!!partner && providerContainer}
            <VolunteeringPartnerCard
              title={t('volunteering:engagementDetail.technicalPartner')}
              name={'Voltastics'}
              partner={VOLUNTEERING_IMG_SOURCES_MAPPING['Voltastics']}
            />
          </View>
        )}
      </ScrollHeaderLayout.Refreshable>

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

export default withProfiler(memo(VolunteeringEngagementDetail), { name: 'VolunteeringEngagementDetail' })

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
    partnerImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
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
