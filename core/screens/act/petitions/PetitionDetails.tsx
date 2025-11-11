import { Screen } from '@holi/core/components/Screen'
import { ButtonTracked } from '@holi/core/components/Trackable'
import { DetailsScreen, type DetailsScreenData, type DetailsScreenInfoList } from '@holi/core/layout/DetailsScreen'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import type { Petition } from '@holi/core/screens/act/petitions/PetitionCard'
import { TrackingEvent } from '@holi/core/tracking'
import useTrackOnce from '@holi/core/tracking/hooks/useTrackOnce'
import { CalendarEventLine, Focus2Line, GoodDeeds, UserLine } from '@holi/icons/src/generated'
import { FooterProgressBar } from 'holi-bricks/components/compactCard/footer/FooterProgressBar'
import { getPlaceholderImage } from 'holi-bricks/components/image/helpers'
import { Stack } from 'holi-bricks/components/stack'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Platform } from 'react-native'
import petitions from './petitions.json'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { HoliTransition } from '@holi/ui/components/atoms/HoliTransition'
import { PetitionProgressCard } from '@holi/core/screens/spaces/tasks/components/PetitionProgressCard'
import {
  Typesense_DocumentContactType,
  type VolunteeringOpportunityStatusValue,
} from '@holi/api/graphql/graphql-codegen'
import type { TypesenseDocument } from '@holi/core/typesense/types'
import { PetitionsStatusValue } from '@holi/core/screens/act/petitions/status'

export type PetitionDetailsParams = {
  petitionId: string
}

const { useParam } = createParamHooks<PetitionDetailsParams>()

export const PetitionDetails = () => {
  const { t } = useTranslation()
  const [petitionId] = useParam('petitionId')
  const [rewardsPhaseTwoEnabled] = useFeatureFlag(FeatureFlagKey.REWARDS_PHASE_2)
  const { navigate } = useRouting()

  const petition = petitions.find((petition) => petition.id === petitionId) as Petition
  const infoList: DetailsScreenInfoList[] = [
    { title: `${t('act.petitions.createdBy', { initiatorNames: petition.startedBy })}`, icon: UserLine },
    { title: `${t('act.petitions.towards', { targetNames: petition.targetOrganisation })}`, icon: Focus2Line },
    {
      title: `${petition.daysLeft ? t('act.petitions.daysLeft', { days: petition.daysLeft }) : t('act.petitions.noDaysLeft')}`,
      icon: CalendarEventLine,
    },
  ]

  // TODO: Mocked data for development purposes -----------------------------------------------
  // To be replaced by:
  // const { isLoading, document, refetchStatus } = usePetitionsDetailsData(petitionId)
  // const [updatePetitionStatus] = useUpdatePetitionStatusMutation()
  type PetitionDetailsScreenData = DetailsScreenData & {
    externalUrl?: string
    commitmentType?: string
    locationType?: string
    location?: string
    source?: string
    contact?: TypesenseDocument['contact']
  }

  const documentMock: PetitionDetailsScreenData = {
    title: 'Some title',
    externalUrl: 'https://www.lovelace.com',
    contact: [
      { type: Typesense_DocumentContactType.Person, value: 'Ada Lovelace' },
      { type: Typesense_DocumentContactType.Email, value: 'ada@lovelace.com' },
      { type: Typesense_DocumentContactType.Phone, value: '+49 1234 1234567' },
      {
        label: "Ada's Website",
        type: Typesense_DocumentContactType.Website,
        value: 'https://www.lovelace.com',
      },
    ],
    commitmentType: 'once',
    status: PetitionsStatusValue.Completed,
  }

  const refetchStatusMock = async () => {
    return
  }

  const updatePetitionStatusMock = async (params: {
    variables: {
      PetitionId: string | undefined
      newStatus: PetitionsStatusValue
    }
  }) => {
    return params
  }
  // End of mocked data --------------------------------------------------------------------

  const onPetitionStatusChange = async (status: PetitionsStatusValue | VolunteeringOpportunityStatusValue) => {
    if (status === PetitionsStatusValue.Completed || status === PetitionsStatusValue.ToSign) {
      updatePetitionStatusMock({
        variables: {
          PetitionId: petitionId,
          newStatus: status,
        },
      })

      await refetchStatusMock()
    }
  }

  useTrackOnce(TrackingEvent.PetitionDetails.viewed(petitionId as string))

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
        headerLeft: ({ tintColor }) => <HeaderBackButton tintColor={tintColor} onPress={() => navigate('/act')} />,
        navigationCustomOptions: {
          footerShown: false,
        },
      }}
      StickyBottomComponent={
        <Stack
          padding={{ left: 'md', right: 'md', bottom: 'lg' }}
          alignItems="center"
          justifyContent="center"
          alignSelf="center"
          width="100%"
        >
          {petition.externalLink && (
            <Stack width={'100%'} maxWidth="xs">
              <ButtonTracked
                icon={GoodDeeds}
                label={t('act.petitions.cta')}
                onPress={() => {
                  onPetitionStatusChange(PetitionsStatusValue.ToSign)
                  Linking.openURL(petition.externalLink as string)
                }}
                trackingEvent={TrackingEvent.PetitionDetails.findMore}
              />
            </Stack>
          )}
        </Stack>
      }
    >
      <DetailsScreen
        title={petition.title}
        bodyContent={{ content: petition.description || '' }}
        infoList={infoList}
        coverImage={{ uri: petition.imageUrl }}
        placeholderImage={petitionId ? getPlaceholderImage(petitionId) : undefined}
        additionalContent={
          <FooterProgressBar
            progressBarPercentage={petition.percentage}
            progressBarLeft={t('act.petitions.percent', { percentage: petition.percentage })}
          />
        }
        progressCard={
          rewardsPhaseTwoEnabled &&
          documentMock?.status &&
          [PetitionsStatusValue.ToSign, PetitionsStatusValue.Completed].includes(
            documentMock?.status as PetitionsStatusValue
          ) ? (
            <HoliTransition.FadeDown visible>
              <PetitionProgressCard
                status={documentMock?.status as PetitionsStatusValue}
                onStatusChange={onPetitionStatusChange}
                externalLink={petition.externalLink as string}
              />
            </HoliTransition.FadeDown>
          ) : null
        }
      />
    </Screen>
  )
}
