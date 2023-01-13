import { useLazyQuery } from '@apollo/client'
import React, { memo, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Platform, StyleSheet, View, useWindowDimensions } from 'react-native'
import RenderHtml from 'react-native-render-html'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import { displayError } from '@holi/core/errors/helpers'
import { useScrollYHandler } from '@holi/core/helpers'
import createParam from '@holi/core/navigation/hooks/useParam'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import type { BottomTabsScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import VolunteeringDetailImageContainer from '@holi-apps/volunteering/components/VolunteeringDetailImageContainer'
import { AppVolunteeringEngagementByIdResponse, engagementByIdQuery } from '@holi-apps/volunteering/queries'
import { Organizer } from '@holi-apps/volunteering/types'

export type VolunteeringEngagementDetailParams = {
  engagementId: string
}
const { useParam } = createParam<VolunteeringEngagementDetailParams>()

type VolunteeringEngagementDetailProps = NativeStackScreenProps<BottomTabsScreens>
type AboutVolunteeringProps = { description: string; organizer?: Organizer }

const VolunteeringEngagementDetail: React.VFC<VolunteeringEngagementDetailProps> = () => {
  const [engagementId] = useParam('engagementId')
  const { t } = useTranslation()
  const { setOptions } = useUnifiedNavigation()
  const onScreenScroll = useScrollYHandler()
  useLayoutEffect(() => setOptions({ title: t('volunteering:app.name') }), [setOptions, t])
  const mixins = useStyleMixins()
  const aktionMenschUrl = 'https://www.aktion-mensch.de/ueber-uns/die-aktion-mensch'

  const [fetchEngagementById, { loading, data, error }] =
    useLazyQuery<AppVolunteeringEngagementByIdResponse>(engagementByIdQuery)
  const engagement = data?.appVolunteering_engagement
  const { height: deviceHeight, width: deviceWidth } = useWindowDimensions()

  useLayoutEffect(() => {
    if (engagementId && !loading && !engagement) {
      fetchEngagementById({
        variables: {
          id: engagementId,
        },
      })
    }
  }, [fetchEngagementById, engagementId, loading, engagement])

  // TODO: replace with proper loading indicator
  if (!engagementId || loading) {
    return (
      <View style={[mixins.container, styles.messageContainer]}>
        <HoliText>{t('volunteering:volunteeringListing.loading')}</HoliText>
      </View>
    )
  }
  if (error) {
    displayError(error, t('volunteering:volunteeringListing.error'))
  }

  const openExternalLink = () => {
    engagement && Linking.openURL(engagement.url)
  }

  const ProviderContainer = ({ source, url }: { source: string; url: string }) => {
    return (
      <View style={styles.cardContainer}>
        <HoliText size={'large'}>{t('volunteering:engagementDetail.provider')}</HoliText>
        <View style={styles.providerInfoRow}>
          <View style={{ flex: 3 }}>
            <HoliText>{source}</HoliText>
          </View>
          <HoliButton
            style={styles.shareButton}
            label={t('modal.backdrop')}
            inline
            transparent
            onPress={() => {
              Linking.openURL(url)
            }}
          >
            <HoliIcon icon="share-box" size={15} color={colors.backgroundColorModalDark} />
          </HoliButton>
        </View>
      </View>
    )
  }

  const Organiser = ({ organiser }: { organiser: Organizer }) => {
    return (
      <View style={{ marginTop: 10 }}>
        <HoliText size={'large'}>{t('volunteering:engagementDetail.organiser')}</HoliText>
        <View style={styles.organiserInfoRow}>
          {(organiser.imageUrl && organiser.imageUrl.length > 0 && (
            <HoliImage source={{ uri: organiser.imageUrl }} style={styles.organiserLogo} label={organiser.name ?? ''} />
          )) || <></>}
          <HoliText>{organiser.name}</HoliText>
        </View>
      </View>
    )
  }

  const AboutVolunteering = ({ description, organizer }: AboutVolunteeringProps) => {
    return (
      <View style={styles.cardContainer}>
        <HoliText size={'large'}>{t('volunteering:engagementDetail.aboutEngagement')}</HoliText>
        <RenderHtml source={{ html: `${description}` }} contentWidth={deviceWidth} />
        {organizer && <Organiser organiser={organizer} />}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <DefaultLayout
        onScroll={onScreenScroll}
        scrollEventThrottle={200}
        style={{ backgroundColor: colors.backgroundColorGreyLight, paddingTop: 20 }}
      >
        {engagement && (
          <View style={[mixins.container, styles.wrapper, { minHeight: deviceHeight }]}>
            <VolunteeringDetailImageContainer
              imageUrl={engagement.imageUrl ?? ''}
              category={engagement.categories[0]}
              title={engagement.title}
              location={engagement.location ?? undefined}
            />
            <AboutVolunteering description={engagement.description} organizer={engagement.organizer} />
            <ProviderContainer source={engagement.source} url={aktionMenschUrl} />
          </View>
        )}
      </DefaultLayout>
      <View style={[mixins.container, styles.volunteeringButton]}>
        <HoliButtonLoading
          icon="share-box"
          label={t('volunteering:engagementDetail.getInTouch')}
          onPress={() => openExternalLink()}
          testID="donations-project-detail-donate-btn"
        />
      </View>
    </View>
  )
}

export default memo(VolunteeringEngagementDetail)

const styles = StyleSheet.create({
  messageContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  container: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: colors.backgroundColorGreyLight,
  },
  wrapper: {
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
    backgroundColor: 'white',
    borderRadius: 32,
    padding: 24,
    marginTop: 2,
  },
  organiserInfoRow: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  organiserLogo: {
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
  shareButton: {
    display: 'flex',
    flex: 1,
    alignItems: 'flex-end',
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
