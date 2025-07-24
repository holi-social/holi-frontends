import React, { useCallback, useState } from 'react'
import { Linking, Platform } from 'react-native'

import { Screen } from '@holi/core/components/Screen'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { white } from 'holi-bricks/foundations'
import { DetailsScreen } from '@holi/core/layout/DetailsScreen'
import { useVolunteeringDetailsData } from '@holi-apps/volunteering/hooks/useVolunteeringDetailsData'
import { VolunteeringSimilarRecos } from '@holi-apps/volunteering/components/VolunteeringSimilarRecos'
import { HoliTransition } from '@holi/ui/components/atoms/HoliTransition'
import { FavoritingButton } from '@holi/core/components/FavoritingButton'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { FavoritableType, useFavoriteExternalVolunteeringOpportunityQuery } from '@holi/api/graphql/graphql-codegen'
import { VolunteeringContact } from '@holi-apps/volunteering/components/VolunteeringContact'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliWebView from '@holi/core/components/HoliWebView'
import { useTheme } from '@holi/ui/styles/theme'

const isIos = Platform.OS === 'ios'
const isWeb = Platform.OS === 'web'

export const VolunteeringDetailsScreen = ({ engagementId }: { engagementId: string }) => {
  const { theme } = useTheme()
  const { displayError } = useErrorHandling()
  const { show: showWebView, props: webViewModalProps } = useModalState()
  const [webViewUrl, setWebViewUrl] = useState<string>()
  const onOpenLink = useCallback(
    (url?: string) => {
      if (!url) {
        return
      }
      if (isWeb) {
        Linking.openURL(url)
      } else {
        setWebViewUrl(url)
        showWebView()
      }
    },
    [showWebView]
  )
  const { isLoading, document } = useVolunteeringDetailsData(engagementId, onOpenLink)

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
                __typename={'Typesense_Document'}
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
        document && <VolunteeringContact engagementId={engagementId} document={document} onOpenLink={onOpenLink} />
      }
      testID="volunteering-detailview-container"
    >
      <DetailsScreen
        loading={isLoading}
        {...document}
        title={document?.title ?? ''}
        // TODO Stefano: Move inside the layout and remove _footer prop
        _footer={<VolunteeringSimilarRecos documentId={`volunteering_${engagementId}`} />}
      />
      {webViewUrl && !isWeb && (
        <HoliModal
          label="modal"
          animationType="slide"
          style={{ width: '100%', height: '100%', flex: 1 }}
          shown={webViewModalProps.shown}
          onDismiss={webViewModalProps.onDismiss}
          testID="volunteering-external-url-modal"
        >
          <HoliWebView
            theme={theme}
            style={{ flex: 1, height: '100%', width: '100%' }}
            webViewProps={{ setSupportMultipleWindows: false, source: { uri: webViewUrl } }}
          />
        </HoliModal>
      )}
    </Screen>
  )
}
