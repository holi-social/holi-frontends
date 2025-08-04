import React, { useState } from 'react'
import { Platform } from 'react-native'

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
import { useOpenLink } from '@holi/ui/helper/useOpenLink'
import {
  VolunteeringProgressCard,
  type VolunteeringProgressStatus,
} from '@holi-apps/volunteering/components/VolunteeringProgressCard'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { Stack } from 'holi-bricks/components/stack'
import HoliLottie from '@holi/ui/components/atoms/HoliLottie'
import { VolunteeringProgressStepper } from '@holi-apps/volunteering/components/VolunteeringProgressCard/VolunteeringProgressStepper'

const isIos = Platform.OS === 'ios'

export const VolunteeringDetailsScreen = ({ engagementId }: { engagementId: string }) => {
  const { displayError } = useErrorHandling()
  const onOpenLink = useOpenLink()

  const [engagementStatus, setEngagementStatus] = useState<VolunteeringProgressStatus | undefined>(undefined)
  const { show: showConnectedStatusModal, props: connectedStatusModalProps } = useModalState()
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
        document && (
          <VolunteeringContact
            engagementId={engagementId}
            document={document}
            onOpenLink={onOpenLink}
            onModalDismiss={() => {
              showConnectedStatusModal()
              setEngagementStatus('contact')
            }}
          />
        )
      }
      testID="volunteering-detailview-container"
    >
      <DetailsScreen
        loading={isLoading}
        {...document}
        title={document?.title ?? ''}
        // TODO Stefano: Move inside the layout and remove _footer prop
        _footer={<VolunteeringSimilarRecos documentId={`volunteering_${engagementId}`} />}
        progressCard={
          <HoliTransition.FadeDown visible={!!(document && engagementStatus)}>
            <VolunteeringProgressCard
              status={engagementStatus}
              document={document!}
              engagementId={engagementId}
              onStatusChange={setEngagementStatus}
            />

            <HoliModal {...connectedStatusModalProps} label="Connected status">
              <HoliContainer>
                <Stack width="100%">
                  <HoliLottie animType="contactedSuccess" loop={false} />
                </Stack>

                <VolunteeringProgressStepper status={'do'} />
              </HoliContainer>
            </HoliModal>
          </HoliTransition.FadeDown>
        }
      />
    </Screen>
  )
}
