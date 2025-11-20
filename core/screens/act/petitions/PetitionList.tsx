import React from 'react'
import { useTranslation } from 'react-i18next'

import { Text } from 'holi-bricks/components/text'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { Stack } from 'holi-bricks/components/stack'
import { Screen } from '@holi/core/components/Screen'
import { Image } from 'holi-bricks/components/image'
import InfoModal from '@holi/core/components/InfoModal'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { usePetitions } from '@holi-apps/volunteering/hooks/useVolunteeringDetailsData/usePetitions'
import PetitionCard, { type Petition } from '@holi/core/screens/act/petitions/PetitionCard'
import { Button } from 'holi-bricks/components/button'

export const PetitionList = () => {
  const { t } = useTranslation()
  const { show: showPartnerModal, hide: closePartnerModal, visible: partnerModalVisible } = useModalState()
  const { petitions, totalResults, canFetchMore, fetchNextPage } = usePetitions({ displayErrors: true })

  return (
    <Screen
      preset="scroll"
      padding={{ left: 'sm', right: 'sm' }}
      headerOptions={{
        headerTitle: () => (
          <Text headingLevel="2" size="lg">
            {t('petitions.title')}
          </Text>
        ),
        headerLeft: () => <HeaderBackButton />,
        headerBackVisible: false,
        headerTitleAlign: 'center',
      }}
    >
      <Stack padding={{ top: 'md', bottom: 'md' }} gap="md">
        <Stack gap="xs">
          <Text headingLevel="1" size="3xl">
            {t('petitions.title')}
          </Text>

          <Stack direction="row" alignItems="center" gap="3xs" onPress={showPartnerModal}>
            <Image source={require('@holi/ui/assets/img/logo/innnit.png')} width={40} height={40} alt="logo innnit" />
            <Text>{t('petitionOverview.partnersTitle')}</Text>
          </Stack>

          <Text>{t('petitionOverview.totalCount', { number: totalResults })}</Text>
        </Stack>

        <Stack gap="3xs">
          {petitions.map((petition) => (
            <PetitionCard petition={petition as Petition} key={petition.id} />
          ))}
        </Stack>

        {canFetchMore && (
          <Stack padding={{ bottom: 'md' }}>
            <Button
              label={t('global.seeMore')}
              loadingLabel={t('global.loading')}
              inline
              onPress={fetchNextPage}
              testID="btn-fetch-more"
            />
          </Stack>
        )}
      </Stack>

      <InfoModal
        headline={t('volunteering.listing.partnerModal.headline')}
        items={{
          innnIt: {
            text: 'innn.it',
            wordmark: {
              src: require('@holi/ui/assets/img/logo/innnit.svg'),
              width: 42,
              height: 21,
            },
            url: 'https://innn.it',
          },
        }}
        shown={partnerModalVisible}
        onDismiss={closePartnerModal}
        i18nPrefix={'act.petitions.listing.partnerModal'}
      />
    </Screen>
  )
}
