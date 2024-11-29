import { useMutation, useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React, { memo, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Platform, StyleSheet, View } from 'react-native'
import RenderHtml from 'react-native-render-html'

import HoliHead from '@holi/core/components/HoliHead'
import { InfoModalItemProps } from '@holi/core/components/InfoModal'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { HoliButtonLoadingTracked } from '@holi/core/components/Trackable'
import { isNotFoundError, logError } from '@holi/core/errors/helpers'
import { useErrorHandling } from '@holi/core/errors/hooks'
import PosthogFeatureFlagGuard from '@holi/core/featureFlags/components/PosthogFeatureFlagGuard'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import { useCardWidth } from '@holi/core/screens/homeFeed/components/Recommendations'
import { TrackingEvent } from '@holi/core/tracking'
import { ShareBox } from '@holi/icons/src/generated'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import { useWindowDimensionsWithImageScaling } from '@holi/ui/components/atoms/HoliImage/useWindowDimensionsWithImageScaling'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import VolunteeringDetailHeader from '@holi-apps/volunteering/components/VolunteeringDetailHeader'
import VolunteeringPartnerCard from '@holi-apps/volunteering/components/VolunteeringPartnerCard'
import VolunteeringSimilarRecosSlider from '@holi-apps/volunteering/components/VolunteeringSimilarRecosSlider'
import {
  AppVolunteeringEngagementByIdResponse,
  TrackEngagementViewResponse,
  engagementByIdQuery,
  trackEngagementViewMutation,
} from '@holi-apps/volunteering/queries'
import { Organizer } from '@holi-apps/volunteering/types'

export const VOLUNTEERING_IMG_SOURCES_MAPPING: {
  [name: string]: InfoModalItemProps
} = {
  Voltastics: {
    logo: {
      src: require('@holi/ui/assets/img/volunteering/voltastics-logo.png'),
      isSvg: false,
    },
    wordmark: {
      src: require('@holi/ui/assets/img/volunteering/voltastics-wordmark.png'),
      width: 159,
      height: 24,
      isSvg: false,
    },
    url: 'https://voltastics.com/',
  },
  'Aktion Mensch': {
    logo: {
      src: require('@holi/ui/assets/img/volunteering/aktion-mensch-logo.svg'),
      isSvg: true,
    },
    wordmark: {
      src: require('@holi/ui/assets/img/volunteering/aktion-mensch-wordmark.svg'),
      width: 60,
      height: 24,
      isSvg: true,
    },
    url: 'https://aktion-mensch.de/ueber-uns/die-aktion-mensch',
  },
  'vostel.de': {
    logo: {
      src: require('@holi/ui/assets/img/volunteering/vostel-logo.svg'),
      isSvg: true,
    },
    wordmark: {
      src: require('@holi/ui/assets/img/volunteering/vostel-wordmark.svg'),
      width: 71,
      height: 24,
      isSvg: true,
    },
    url: 'https://vostel.de/de/ueber_vostel',
  },
  GoNature: {
    logo: {
      src: require('@holi/ui/assets/img/volunteering/gonature-logo.svg'),
      isSvg: true,
    },
    wordmark: {
      src: require('@holi/ui/assets/img/volunteering/gonature-wordmark.svg'),
      width: 76,
      height: 24,
      isSvg: true,
    },
    url: 'https://gonature.de/ueber-uns',
  },
  GoVolunteer: {
    logo: {
      src: require('@holi/ui/assets/img/volunteering/govolunteer-logo.svg'),
      isSvg: true,
    },
    wordmark: {
      src: require('@holi/ui/assets/img/volunteering/govolunteer-wordmark.svg'),
      width: 119,
      height: 24,
      isSvg: true,
    },
    url: 'https://govolunteer.com/ueber-uns',
  },
  'German Volunteers': {
    logo: {
      src: require('@holi/ui/assets/img/volunteering/german-volunteers-logo.svg'),
      isSvg: true,
    },
    wordmark: {
      src: require('@holi/ui/assets/img/volunteering/german-volunteers-wordmark.svg'),
      width: 46,
      height: 24,
      isSvg: true,
    },
    url: 'https://germanvolunteers.de/uber-uns',
  },
}

export type VolunteeringEngagementDetailParams = {
  engagementId: string
}
const { useParam } = createParamHooks<VolunteeringEngagementDetailParams>()

interface AboutVolunteeringProps {
  description: string
  organizer?: Organizer
}

const VolunteeringEngagementDetail = () => {
  const [engagementId] = useParam('engagementId')
  const { t } = useTranslation()
  const { replaceRoute } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  useIsomorphicLayoutEffect(() => {
    setScreenOptions({ title: t('volunteering:app.name'), headerTransparent: true })
  }, [setScreenOptions, t])
  const mixins = useStyleMixins()
  const { displayError } = useErrorHandling()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const cardWidth = useCardWidth()

  const { loading, data, refetch } = useQuery<AppVolunteeringEngagementByIdResponse>(engagementByIdQuery, {
    variables: {
      id: engagementId,
    },
    skip: !engagementId,
    onError: (error) => {
      if (isNotFoundError(error)) {
        return replaceRoute('/404')
      }
      return displayError(error, 'Failed to load volunteering engagement', {
        displayMessage: t('volunteering:engagementDetail.notFound'),
        location: 'VolunteeringEngagementDetail.engagementByIdQuery',
        engagementId,
      })
    },
  })
  const [trackEngagementView] = useMutation<TrackEngagementViewResponse>(trackEngagementViewMutation, {
    variables: { id: engagementId },
    onError: (error) =>
      logError(error, 'Error tracking view for volunteering engagement', {
        location: 'VolunteeringEngagementDetail.trackEngagementViewMutation',
        engagementId,
      }),
  })
  const engagement = data?.appVolunteering_engagement

  useOnRefresh(refetch)

  const { windowHeight, windowWidth, imageWidth } = useWindowDimensionsWithImageScaling()

  useEffect(() => {
    if (engagementId) {
      trackEngagementView()
    }
  }, [trackEngagementView, engagementId])

  if (!engagementId || loading || !engagement) {
    return <HoliLoader />
  }

  const partner = VOLUNTEERING_IMG_SOURCES_MAPPING[engagement.source]
  const providerContainer = (
    <VolunteeringPartnerCard
      headline={t('volunteering:engagementDetail.provider')}
      name={engagement.source}
      partner={partner}
    />
  )

  const Organizer = ({ organizer: organizer }: { organizer: Organizer }) => {
    return (
      <View style={{ marginTop: 10 }}>
        <HoliText size={'large'}>{t('volunteering:engagementDetail.organizer')}</HoliText>
        <View style={styles.organizerInfoRow}>
          {(!!organizer.imageUrl && (
            <HoliImage
              source={{ uri: organizer.imageUrl, width: styles.partnerImage.width, height: styles.partnerImage.height }}
              style={styles.partnerImage}
              label={organizer.name ?? ''}
              resizeMode={'contain'}
            />
          )) || <></>}
          <HoliText style={styles.organizerName}>{organizer.name}</HoliText>
        </View>
      </View>
    )
  }

  const AboutVolunteering = ({ description, organizer }: AboutVolunteeringProps) => {
    return (
      <View
        style={[styles.cardContainer, windowWidth > 0 && { maxWidth: windowWidth }]}
        testID="volunteering-engagement-description"
      >
        <HoliText size={'large'}>{t('volunteering:engagementDetail.aboutEngagement')}</HoliText>
        <RenderHtml
          source={{ html: `${description}` }}
          contentWidth={windowWidth}
          defaultTextProps={{ selectable: true }}
        />
        {organizer && <Organizer organizer={organizer} />}
      </View>
    )
  }

  return (
    <View testID="volunteering-detailview-container">
      <HoliHead
        title={engagement.title}
        description={engagement.description}
        ogTitle={engagement.title}
        ogDescription={engagement.description}
        ogImage={engagement.imageUrl}
      />
      <ScrollHeaderLayout style={styles.header}>
        {engagement && (
          <View style={[mixins.container, styles.container, { minHeight: windowHeight }]}>
            <VolunteeringDetailHeader engagement={engagement} imageWidth={imageWidth} />
            <AboutVolunteering description={engagement.description} organizer={engagement.organizer} />
            {!!partner && providerContainer}
            <VolunteeringPartnerCard
              headline={t('volunteering:engagementDetail.technicalPartner')}
              name={'Voltastics'}
              partner={VOLUNTEERING_IMG_SOURCES_MAPPING['Voltastics']}
            />
            <View style={styles.similarRecos}>
              <HoliHeading size={'m'} weight={'400'}>
                {t('volunteering:engagementDetail.similarRecosHeading')}
              </HoliHeading>
              <VolunteeringSimilarRecosSlider engagementId={engagement.id} cardWidth={cardWidth} />
            </View>
          </View>
        )}
      </ScrollHeaderLayout>

      <View style={styles.volunteeringButton}>
        <HoliButtonLoadingTracked
          icon={ShareBox}
          label={t('volunteering:engagementDetail.getInTouch')}
          onPress={() => Linking.openURL(engagement.url)}
          testID="volunteering-engagement-get-in-touch-btn"
          trackingEvent={TrackingEvent.Volunteering.pressed(engagementId)}
        />
      </View>
    </View>
  )
}

const WrappedVolunteeringEngagementDetail = () => (
  <PosthogFeatureFlagGuard featureFlagKey={FeatureFlagKey.VOLUNTEERING} i18nKey="volunteering:maintenance.feature">
    <VolunteeringEngagementDetail />
  </PosthogFeatureFlagGuard>
)

export default withProfiler(memo(WrappedVolunteeringEngagementDetail), { name: 'VolunteeringEngagementDetail' })

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    header: {
      backgroundColor: theme.colors.background30,
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
    cardContainer: {
      width: '100%',
      backgroundColor: theme.colors.background10,
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
    organizerName: {
      flex: 1,
    },
    partnerImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 16,
    },
    volunteeringButton: {
      bottom: 40,
      alignSelf: 'center',
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
    similarRecos: {
      paddingTop: 42,
      padding: 24,
      gap: 18,
    },
  })
