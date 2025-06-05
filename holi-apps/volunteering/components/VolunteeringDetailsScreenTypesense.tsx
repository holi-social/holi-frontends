import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Platform } from 'react-native'

import { Screen } from '@holi/core/components/Screen'
import { Stack } from 'holi-bricks/components/stack'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { white } from 'holi-bricks/foundations'
import { ExternalLink } from '@holi/icons/src/generated'
import HoliWebView from '@holi/core/components/HoliWebView'
import { useTheme } from '@holi/ui/styles/theme'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { ButtonTracked } from '@holi/core/components/Trackable'
import { TrackingEvent } from '@holi/core/tracking'
import { DetailsScreen } from '@holi/core/layout/DetailsScreen'
import { useVolunteeringDetailsDataTypesense } from '@holi-apps/volunteering/hooks/useVolunteeringDetailsData'
import { useTrackEngagementViewMutation } from '@holi/api/graphql/graphql-codegen'
import { logError } from '@holi/core/errors/helpers'
import { VolunteeringSimilarRecosFooter } from '@holi-apps/volunteering/components/VolunteeringSimilarRecosFooter'

export const VolunteeringDetailsScreenTypesense = ({ engagementId }: { engagementId: string }) => {
  const { t } = useTranslation()
  const { isLoading, document } = useVolunteeringDetailsDataTypesense(engagementId)
  const { theme } = useTheme()
  const { show, props: modalProps } = useModalState()
  const hasTrackedRef = useRef<string>('')

  const [trackEngagementView] = useTrackEngagementViewMutation({
    onError: (error) =>
      logError(error, 'Error tracking view for volunteering engagement', {
        location: 'VolunteeringEngagementDetail.trackEngagementViewMutation',
        engagementId,
      }),
  })

  useEffect(() => {
    if (document && hasTrackedRef.current !== engagementId) {
      trackEngagementView({ variables: { id: engagementId } })
      hasTrackedRef.current = engagementId
    }
  }, [document, engagementId, trackEngagementView])

  return (
    <Screen
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
            trackingEvent={TrackingEvent.Volunteering.pressed(engagementId, {
              commitmentType: document?.commitmentType,
              locationType: document?.locationType,
            })}
            icon={ExternalLink}
            label={t('volunteering:engagementDetail.getInTouch')}
            onPress={() => {
              if (document?.externalUrl) {
                if (Platform.OS === 'web') {
                  Linking.openURL(document?.externalUrl)
                } else {
                  show()
                }
              }
            }}
            testID="volunteering-engagement-get-in-touch-btn"
          />
        </Stack>
      }
      testID="volunteering-detailview-container"
    >
      <DetailsScreen
        loading={isLoading}
        coverImage={document?.coverImage}
        title={document?.title ?? ''}
        infoList={document?.infoList}
        visibility="public"
        bodyContent={document?.bodyContent}
        author={document?.author}
        chips={document?.chips}
        // TODO Stefano: Move inside the layout and remove _footer prop
        _footer={<VolunteeringSimilarRecosFooter engagementId={engagementId} />}
      />
      {document?.externalUrl && Platform.OS !== 'web' && (
        <HoliModal
          label="modal"
          animationType="slide"
          style={{ width: '100%', height: '100%', flex: 1 }}
          shown={modalProps.shown}
          onDismiss={modalProps.onDismiss}
          testID={'volunteering-external-url-modal'}
        >
          <HoliWebView
            theme={theme}
            style={{ flex: 1, height: '100%', width: '100%' }}
            webViewProps={{ setSupportMultipleWindows: false, source: { uri: document?.externalUrl } }}
          />
        </HoliModal>
      )}
    </Screen>
  )
}
