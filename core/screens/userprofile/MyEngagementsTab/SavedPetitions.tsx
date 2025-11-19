import React from 'react'
import { useTranslation } from 'react-i18next'
import { Stack } from 'holi-bricks/components/stack'
import { Text, TextLink } from 'holi-bricks/components/text'
import { ChipLabel } from 'holi-bricks/components/chips'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Information } from '@holi/icons/src/generated'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import { Spacing } from 'holi-bricks/foundations'
import ErrorBoundary from '@holi/core/errors/components/ErrorBoundary'
import { usePetitionStatuses } from '@holi/core/screens/userprofile/hooks/usePetitionStatuses'
import PetitionCard from '@holi/core/screens/act/petitions/PetitionCard'
import { PetitionsEmptyState } from '@holi/core/screens/userprofile/components/PetitionsEmptyState'
import { useSignedPetitionsQuery } from '@holi/api/graphql/graphql-codegen'

const StatusInfoHeader = () => {
  const { t } = useTranslation()
  const { petitionStatuses } = usePetitionStatuses()
  const { show, hide, props: modalProps } = useModalState()

  return (
    <Stack>
      <TextLink size="sm" onPress={show} color="purpleDark">
        <Stack direction="row" alignItems="center" gap="4xs">
          <Text size="lg" color="purpleDark">
            {t('profile.myVolunteer.link.status')}
          </Text>
          <HoliIcon icon={Information} colorOverride="purpleDark" size={18} />
        </Stack>
      </TextLink>

      <HoliModal label={t('profile.myVolunteer.modal.title')} {...modalProps}>
        <HoliModalContentWrapper actionButtonText={t('modal.close')} onActionButtonPress={hide}>
          <Stack gap="md" padding={{ bottom: 'md', left: 'md', right: 'md' }}>
            <Stack gap="3xs">
              <Text size="3xl">{t('profile.myVolunteer.status.modal.petitions.title')}</Text>
            </Stack>

            <Stack gap="xs">
              {petitionStatuses.map(({ description, chip }) => (
                <Stack key={description} gap="4xs">
                  <ChipLabel {...chip} />
                  <Text>{description}</Text>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </HoliModalContentWrapper>
      </HoliModal>
    </Stack>
  )
}

export const SavedPetitions = () => {
  const { styles } = useStyles(stylesheet)
  const { t } = useTranslation()

  const { data, loading } = useSignedPetitionsQuery({ fetchPolicy: 'cache-first' })
  const signedPetitions = data?.signedPetitions.data || []
  const totalResults = data?.signedPetitions.totalResults

  if (loading) {
    return (
      <Stack padding={{ top: '3xl' }}>
        <HoliLoader testID="initial-loader" style={styles.loader} />
      </Stack>
    )
  }

  if (!loading && totalResults === 0) {
    return (
      <Stack padding={{ bottom: 'xs' }} gap="xxs">
        <Stack direction="row" justifyContent="space-between">
          <Text size="xl">{t('profile.tabs.myVolunteer.petitions.title')}</Text>
          <StatusInfoHeader />
        </Stack>
        <PetitionsEmptyState />
      </Stack>
    )
  }

  return (
    <Stack padding={{ bottom: 'xs' }} gap="xxs">
      <Stack direction="row" justifyContent="space-between">
        <Text size="xl">{t('profile.tabs.myVolunteer.petitions.title')}</Text>
        <StatusInfoHeader />
      </Stack>

      <Stack gap="xs">
        {signedPetitions.map((item) => (
          <ErrorBoundary key={item.externalPetitionId}>
            <PetitionCard externalPetitionId={item.externalPetitionId} status={item.status} showCommitmentStatus />
          </ErrorBoundary>
        ))}
      </Stack>
    </Stack>
  )
}

const stylesheet = createStyleSheet(() => ({
  loader: {
    padding: Spacing.xs,
  },
}))
