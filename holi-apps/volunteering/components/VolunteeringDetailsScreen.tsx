import React from 'react'
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
import { useVolunteeringDetailsData } from '@holi-apps/volunteering/hooks/useVolunteeringDetailsData'
import { VolunteeringSimilarRecos } from '@holi-apps/volunteering/components/VolunteeringSimilarRecos'
import { HoliTransition } from '@holi/ui/components/atoms/HoliTransition'
import { FavoritingButton } from '@holi/core/components/FavoritingButton'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { FavoritableType, useFavoriteExternalVolunteeringOpportunityQuery } from '@holi/api/graphql/graphql-codegen'

const isIos = Platform.OS === 'ios'

export const VolunteeringDetailsScreen = ({ engagementId }: { engagementId: string }) => {
  const { displayError } = useErrorHandling()
  const { t } = useTranslation()
  const { isLoading, document } = useVolunteeringDetailsData(engagementId)
  const { theme } = useTheme()
  const { show, props: modalProps } = useModalState()

  const {
    data: { favorite } = {},
    error,
    refetch: refetchFavorite,
  } = useFavoriteExternalVolunteeringOpportunityQuery({
    variables: { favoritableId: engagementId },
  })
  const isFavorite = !!favorite && !error

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
        headerRight: ({ tintColor }) =>
          !!document && (
            <HoliTransition.FadeRight visible>
              <FavoritingButton
                favoritableId={engagementId}
                favoritableType={FavoritableType.ExternalVolunteeringOpportunity}
                tintColor={tintColor}
                typename={'Typesense_Document'}
                isFavorite={isFavorite}
                onCompleted={refetchFavorite}
                onError={(error) =>
                  displayError(
                    error,
                    isFavorite
                      ? 'Failed to add the volunteering from favorites'
                      : 'Failed to remove the volunteering from favorites',
                    {
                      location: 'VolunteeringDetailsScreen.favoriteVolunteering',
                      favoritableId: engagementId,
                    }
                  )
                }
              />
            </HoliTransition.FadeRight>
          ),
        navigationCustomOptions: {
          footerShown: false,
        },
      }}
      statusBarProps={{ translucent: isIos, barStyle: isIos ? 'light-content' : 'dark-content' }}
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
              source: document?.source,
            })}
            icon={ExternalLink}
            label={t('volunteering.engagementDetail.getInTouch')}
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
        bodyContent={document?.bodyContent}
        author={document?.author}
        chips={document?.chips}
        // TODO Stefano: Move inside the layout and remove _footer prop
        _footer={<VolunteeringSimilarRecos documentId={`volunteering_${engagementId}`} />}
        placeholderImage={document?.placeholderImage}
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
