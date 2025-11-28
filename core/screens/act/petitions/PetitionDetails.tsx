import { Screen } from '@holi/core/components/Screen'
import { ButtonTracked } from '@holi/core/components/Trackable'
import { DetailsScreen, type DetailsScreenInfoList } from '@holi/core/layout/DetailsScreen'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import { TrackingEvent } from '@holi/core/tracking'
import useTrackOnce from '@holi/core/tracking/hooks/useTrackOnce'
import { Focus2Line, GoodDeeds, PencilFilled, UserLine } from '@holi/icons/src/generated'
import { getPlaceholderImage } from 'holi-bricks/components/image/helpers'
import { Stack } from 'holi-bricks/components/stack'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Platform } from 'react-native'
import { useFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { HoliTransition } from '@holi/ui/components/atoms/HoliTransition'
import { PetitionProgressCard } from '@holi/core/screens/spaces/tasks/components/PetitionProgressCard'
import {
  PetitionStatusValue,
  useUpdatePetitionStatusMutation,
  type VolunteeringOpportunityStatusValue,
} from '@holi/api/graphql/graphql-codegen'
import { usePetitionDetailsData } from '@holi/core/screens/act/petitions/hooks/usePetitionDetailsData'
import { useLoginState } from '@holi/core/auth/loginState'

export type PetitionDetailsParams = {
  petitionId: string
}

const { useParam } = createParamHooks<PetitionDetailsParams>()

export const PetitionDetails = () => {
  const { t } = useTranslation()
  const [petitionId] = useParam('petitionId')
  const [rewardsPhaseTwoEnabled] = useFeatureFlag(FeatureFlagKey.REWARDS_PHASE_2)
  const loginState = useLoginState()

  const { document: petition, status, refetchStatus } = usePetitionDetailsData(petitionId as string)

  const infoList: DetailsScreenInfoList[] = [
    { title: `${t('act.petitions.createdBy', { initiatorNames: petition?.initiators })}`, icon: UserLine },
    {
      title: `${t('act.petitions.towards', { targetNames: petition?.targets?.join(', '), interpolation: { escapeValue: false } })}`,
      icon: Focus2Line,
    },
    {
      title: `${t('act.petitions.signatureCount', { signatureCount: petition?.signatures?.toLocaleString('de-DE') })}`,
      icon: PencilFilled,
    },
  ]

  const [updatePetitionStatus] = useUpdatePetitionStatusMutation()

  const onPetitionStatusChange = async (status: PetitionStatusValue | VolunteeringOpportunityStatusValue) => {
    if (status === PetitionStatusValue.Signed || status === PetitionStatusValue.Planned) {
      await updatePetitionStatus({
        variables: {
          petitionId: petitionId || '',
          newStatus: status,
        },
      })
      await refetchStatus()
    }
  }

  useTrackOnce(TrackingEvent.PetitionDetails.viewed(petitionId as string))

  if (!petition) {
    return null
  }

  return (
    <Screen
      preset="auto"
      statusBarProps={{
        style: Platform.OS === 'ios' ? 'light' : 'auto',
      }}
      headerOptions={{
        animation: 'slide_from_left',
        headerBackVisible: false,
        headerTitleAlign: 'center',
        ...Platform.select({
          native: {
            title: '',
            headerTransparent: true,
          },
        }),
        headerLeft: ({ tintColor }) => <HeaderBackButton tintColor={tintColor} />,
        navigationCustomOptions: {
          footerShown: false,
        },
      }}
      StickyBottomComponent={
        status !== PetitionStatusValue.Signed &&
        status !== PetitionStatusValue.Planned && (
          <Stack
            padding={{ left: 'md', right: 'md', bottom: 'lg' }}
            alignItems="center"
            justifyContent="center"
            alignSelf="center"
            width="100%"
          >
            <Stack width={'100%'} maxWidth="xs">
              <ButtonTracked
                icon={GoodDeeds}
                label={t('act.petitions.cta')}
                onPress={() => {
                  if (loginState.isLoggedIn) onPetitionStatusChange(PetitionStatusValue.Planned)
                  Linking.openURL(`https://innn.it/${petition.slug}`)
                }}
                trackingEvent={TrackingEvent.PetitionDetails.signOnPartnerPagePressed}
              />
            </Stack>
          </Stack>
        )
      }
    >
      <DetailsScreen
        title={petition.title || ''}
        bodyContent={{ content: petition.description || '' }}
        infoList={infoList}
        status={status}
        placeholderImage={petitionId ? getPlaceholderImage(petitionId) : undefined}
        progressCard={
          rewardsPhaseTwoEnabled && status ? (
            <HoliTransition.FadeDown visible>
              <PetitionProgressCard
                status={status as PetitionStatusValue}
                onStatusChange={onPetitionStatusChange}
                externalLink={`https://innn.it/${petition.slug}`}
              />
            </HoliTransition.FadeDown>
          ) : null
        }
      />
    </Screen>
  )
}
