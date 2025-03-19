import { withProfiler } from '@sentry/react'
import React, { useRef, memo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, Linking } from 'react-native'
import RenderHtml from 'react-native-render-html'
import { logError } from '@holi/core/errors/helpers'
import PosthogFeatureFlagGuard from '@holi/core/featureFlags/components/PosthogFeatureFlagGuard'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import { useCardWidth } from '@holi/core/screens/homeFeed/components/Recommendations'
import { Text } from 'holi-bricks/components/text'

import { Screen } from '@holi/core/components/Screen'
import { Stack } from 'holi-bricks/components/stack'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { white } from 'holi-bricks/tokens'
import VolunteeringSimilarRecosSlider from '@holi-apps/volunteering/components/VolunteeringSimilarRecosSlider'
import { useVolunteeringDetailsData } from '@holi-apps/volunteering/hooks/useVolunteeringDetailsData'
import type { VolunteeringEngagement } from '@holi-apps/volunteering/types'
import { useTrackEngagementViewMutation } from '@holi/api/graphql/graphql-codegen'
import { ExternalLink } from '@holi/icons/src/generated'
import HoliWebView from '@holi/core/components/HoliWebView'
import { useTheme } from '@holi/ui/styles/theme'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { ButtonTracked } from '@holi/core/components/Trackable'
import { TrackingEvent } from '@holi/core/tracking'
import { DetailsScreen } from '@holi/core/layout/DetailsScreen'

export type VolunteeringEngagementDetailParams = {
  engagementId: string
}

const { useParam } = createParamHooks<VolunteeringEngagementDetailParams>()

export const VolunteeringEngagementDetail = () => {
  const [engagementId] = useParam('engagementId')
  const { t } = useTranslation()
  const { data, refetch, loading, url, recommendations, id } = useVolunteeringDetailsData(engagementId)
  const cardWidth = useCardWidth()
  const { theme } = useTheme() // Deprecated,  remove when we  will have a new webview
  const { show, props: modalProps } = useModalState()
  const hasTrackedRef = useRef<boolean>(false)

  const [trackEngagementView] = useTrackEngagementViewMutation({
    onError: (error) =>
      logError(error, 'Error tracking view for volunteering engagement', {
        location: 'VolunteeringEngagementDetail.trackEngagementViewMutation',
        engagementId,
      }),
  })

  useEffect(() => {
    if (!loading && id && hasTrackedRef.current === false) {
      trackEngagementView({ variables: { id } })
      hasTrackedRef.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, loading])

  return (
    <Screen
      onRefresh={refetch}
      preset="auto"
      headerOptions={{
        animation: 'slide_from_left',
        headerBackVisible: false,
        headerTitleAlign: 'center',
        ...Platform.select({
          native: {
            headerTintColor: white,
            title: '',
            headerTransparent: true,
          },
        }),
        headerLeft: ({ tintColor }) => <HeaderBackButton tintColor={tintColor} />,
        navigationCustomOptions: {
          footerShown: false,
        },
      }}
      statusBarProps={{ translucent: true, barStyle: 'light-content' }}
      StickyBottomComponent={
        <Stack
          padding={{ left: 'md', right: 'md', bottom: 'lg' }}
          alignItems="center"
          justifyContent="center"
          alignSelf="center"
          width="100%"
        >
          <ButtonTracked
            trackingEvent={TrackingEvent.Volunteering.pressed(id as string)}
            icon={ExternalLink}
            label={t('volunteering.details.cta')}
            onPress={() => {
              if (url) {
                if (Platform.OS === 'web') {
                  Linking.openURL(url)
                } else {
                  show()
                }
              }
            }}
          />
        </Stack>
      }
    >
      <DetailsScreen
        loading={loading}
        coverImage={data?.coverImage}
        title={data?.title}
        infoList={data?.infoList}
        visibility="public"
        description={
          data?.description && (
            <RenderHtml defaultTextProps={{ selectable: true }} source={{ html: data?.description }} contentWidth={0} />
          )
        }
        author={data?.author}
        chips={data?.chips}
        // TODO Stefano: Move inside the layout and remove _footer prop
        _footer={
          <Stack
            shouldRender={recommendations?.length > 0}
            direction="column"
            gap="sm"
            padding={{ left: 'sm' }}
            margin={{ bottom: '3xl' }}
          >
            <Text size="xxl">{t('recommendation.slider.title')}</Text>
            <VolunteeringSimilarRecosSlider cardWidth={cardWidth} recos={recommendations as VolunteeringEngagement[]} />
          </Stack>
        }
      />

      {url && Platform.OS !== 'web' && (
        <HoliModal
          label="modal"
          animationType="slide"
          style={{ width: '100%', height: '100%', flex: 1 }}
          shown={modalProps.shown}
          onDismiss={modalProps.onDismiss}
          testID={'goodnews-partner-modal'}
        >
          <HoliWebView
            theme={theme}
            style={{ flex: 1, height: '100%', width: '100%' }}
            webViewProps={{ setSupportMultipleWindows: false, source: { uri: url } }}
          />
        </HoliModal>
      )}
    </Screen>
  )
}

const WrappedVolunteeringEngagementDetail = () => (
  <PosthogFeatureFlagGuard featureFlagKey={FeatureFlagKey.VOLUNTEERING} i18nKey="volunteering:maintenance.feature">
    <VolunteeringEngagementDetail />
  </PosthogFeatureFlagGuard>
)

export default withProfiler(memo(WrappedVolunteeringEngagementDetail), { name: 'VolunteeringEngagementDetail' })
