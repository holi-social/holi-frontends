import React from 'react'
import { Platform } from 'react-native'

import { Screen } from '@holi/core/components/Screen'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { white } from 'holi-bricks/foundations'
import { DetailsScreen } from '@holi/core/layout/DetailsScreen'
import { useVolunteeringDetailsData } from '@holi-apps/volunteering/hooks/useVolunteeringDetailsData'
import { VolunteeringSimilarRecos } from '@holi-apps/volunteering/components/VolunteeringSimilarRecos'
import { useErrorHandling } from '@holi/core/errors/hooks'
import {
  useFavoriteExternalVolunteeringOpportunityQuery,
  useUpdateVolunteeringOpportunityStatusMutation,
  VolunteeringOpportunityStatusValue,
} from '@holi/api/graphql/graphql-codegen'
import { VolunteeringContact } from '@holi-apps/volunteering/components/VolunteeringContact'
import { useOpenLink } from '@holi/ui/helper/useOpenLink'
import { VolunteeringProgressCard } from '@holi-apps/volunteering/components/VolunteeringProgressCard'
import { HoliTransition } from '@holi/ui/components/atoms/HoliTransition'
import { useFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'

const isIos = Platform.OS === 'ios'

export const VolunteeringDetailsScreen = ({ engagementId }: { engagementId: string }) => {
  const [rewardsPhaseTwoEnabled] = useFeatureFlag(FeatureFlagKey.REWARDS_PHASE_2)

  const { displayError } = useErrorHandling()
  const onOpenLink = useOpenLink()

  const { isLoading, document, refetchStatus } = useVolunteeringDetailsData(engagementId, onOpenLink)
  const [updateVolunteeringOpportunityStatus] = useUpdateVolunteeringOpportunityStatusMutation()
  const onVolunteeringStatusChange = async (status: VolunteeringOpportunityStatusValue) => {
    await updateVolunteeringOpportunityStatus({
      variables: {
        volunteeringOpportunityId: engagementId,
        newStatus: status,
      },
    })

    await refetchStatus()
  }

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
        headerRight: () => null,
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
              if (!rewardsPhaseTwoEnabled) return

              // Update status to "TO_DO" only once when initially the status is null
              if (document?.status === null) onVolunteeringStatusChange(VolunteeringOpportunityStatusValue.ToDo)
            }}
            isFavorite={isFavorite}
            onFavoriteCompleted={refetchFavorite}
            onFavoriteError={(error) =>
              displayError(
                error,
                isFavorite
                  ? 'Failed to save the volunteering to favorites'
                  : 'Failed to remove the volunteering from favorites',
                {
                  location: 'VolunteeringDetailsScreen.favoriteVolunteering',
                  favoritableId: engagementId,
                }
              )
            }
          />
        )
      }
      testID="volunteering-detailview-container"
    >
      <DetailsScreen
        loading={isLoading}
        {...document}
        title={document?.title ?? ''}
        status={document?.status ?? null}
        // TODO Stefano: Move inside the layout and remove _footer prop
        _footer={<VolunteeringSimilarRecos documentId={`volunteering_${engagementId}`} />}
        progressCard={
          // Progress card is only visible when the status is not null and is one of the following:
          // - TO_DO
          // - CONTACTED
          // - DOING
          rewardsPhaseTwoEnabled ? (
            <HoliTransition.FadeDown
              visible={
                !!document?.status &&
                [
                  VolunteeringOpportunityStatusValue.ToDo,
                  VolunteeringOpportunityStatusValue.Contacted,
                  VolunteeringOpportunityStatusValue.Doing,
                ].includes(document?.status)
              }
            >
              <VolunteeringProgressCard
                status={document?.status ?? VolunteeringOpportunityStatusValue.ToDo}
                document={document!}
                engagementId={engagementId}
                onStatusChange={onVolunteeringStatusChange}
              />
            </HoliTransition.FadeDown>
          ) : null
        }
      />
    </Screen>
  )
}
