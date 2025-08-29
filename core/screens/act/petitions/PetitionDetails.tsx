import { Screen } from '@holi/core/components/Screen'
import { ButtonTracked } from '@holi/core/components/Trackable'
import { DetailsScreen, type DetailsScreenInfoList } from '@holi/core/layout/DetailsScreen'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import type { Petition } from '@holi/core/screens/act/petitions/PetitionCard'
import { TrackingEvent } from '@holi/core/tracking'
import useTrackOnce from '@holi/core/tracking/hooks/useTrackOnce'
import { CalendarEventLine, ExternalLink, Focus2Line, UserLine } from '@holi/icons/src/generated'
import { FooterProgressBar } from 'holi-bricks/components/compactCard/footer/FooterProgressBar'
import { getPlaceholderImage } from 'holi-bricks/components/image/helpers'
import { Stack } from 'holi-bricks/components/stack'
import { white } from 'holi-bricks/foundations'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Platform } from 'react-native'
import petitions from './petitions.json'
import useRouting from '@holi/core/navigation/hooks/useRouting'

export type PetitionDetailsParams = {
  petitionId: string
}

const { useParam } = createParamHooks<PetitionDetailsParams>()

export const PetitionDetails = () => {
  const { t } = useTranslation()
  const [petitionId] = useParam('petitionId')
  const { navigate } = useRouting()
  const petition = petitions.find((petition) => petition.id === petitionId) as Petition
  const infoList: DetailsScreenInfoList[] = [
    { title: `${t('act.petitions.createdBy')} ${petition.startedBy}`, icon: UserLine },
    { title: `${t('act.petitions.towards')} ${petition.targetOrganisation}`, icon: Focus2Line },
    {
      title: `${petition.daysLeft ? t('act.petitions.daysLeft', { days: petition.daysLeft }) : t('act.petitions.noDaysLeft')}`,
      icon: CalendarEventLine,
    },
  ]

  useTrackOnce(TrackingEvent.PetitionDetails.viewed(petitionId as string))

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
        headerLeft: ({ tintColor }) => (
          <HeaderBackButton tintColor={tintColor} onPress={() => navigate('/act')} shadow="dark" />
        ),
        navigationCustomOptions: {
          footerShown: false,
        },
        statusBarStyle: 'light',
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
                icon={ExternalLink}
                label={t('act.petitions.cta')}
                onPress={() => {
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
      />
    </Screen>
  )
}
