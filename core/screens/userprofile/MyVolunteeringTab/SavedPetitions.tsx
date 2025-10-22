import React from 'react'
import { useTranslation } from 'react-i18next'
import { Stack } from 'holi-bricks/components/stack'
import { Text, TextLink } from 'holi-bricks/components/text'
import { ChipLabel } from 'holi-bricks/components/chips'
import { Button } from 'holi-bricks/components/button'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Information } from '@holi/icons/src/generated'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import { Spacing } from 'holi-bricks/foundations'
import ErrorBoundary from '@holi/core/errors/components/ErrorBoundary'
import { usePetitionStatuses } from '@holi/core/screens/userprofile/hooks/usePetitionStatuses'
import PetitionCard, { type Petition } from '@holi/core/screens/act/petitions/PetitionCard'
import petitions from '@holi/core/screens/act/petitions/petitions.json'
import { PetitionsEmptyState } from '@holi/core/screens/userprofile/components/PetitionsEmptyState'

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
  // const {
  //   items: committedVolunteeringOpportunities,
  //   canFetchMore,
  //   isFetchingMore,
  //   isLoading,
  //   isInitialLoad,
  //   fetchMore,
  //   totalResults,
  //   refetch,
  //   error,
  // } = useCommittedVolunteering()
  const canFetchMore = false // mocked
  const isFetchingMore = false // mocked
  const isLoading = false // mocked
  const isInitialLoad = false // mocked
  const fetchMore = async () => {} // mocked
  const totalResults = 5 // mocked
  // const refetch = async () => {} // mocked

  // useEffect(() => {
  //   refetch()
  // }, [refetch])

  if (isInitialLoad) {
    return (
      <Stack padding={{ top: '3xl' }}>
        <HoliLoader testID="initial-loader" style={styles.loader} />
      </Stack>
    )
  }

  if (!isLoading && totalResults === 0) {
    return (
      <Stack padding={{ bottom: 'xs' }} gap="xxs">
        <Stack direction="row" justifyContent="space-between">
          {/* todo: localazy */}
          <Text size="xl">My Petitions</Text>
          <StatusInfoHeader />
        </Stack>
        <PetitionsEmptyState />
      </Stack>
    )
  }

  const committedPetitions = petitions.filter(
    (petition) => petition.status === 'COMPLETED' || petition.status === 'TO_SIGN'
  ) as Petition[]

  return (
    <Stack padding={{ bottom: 'xs' }} gap="xxs">
      <Stack direction="row" justifyContent="space-between">
        {/* todo: localazy */}
        <Text size="xl">My Petitions</Text>
        <StatusInfoHeader />
      </Stack>

      <Stack gap="xs">
        {committedPetitions.map((item) => (
          <ErrorBoundary key={item.id}>
            <PetitionCard petition={item} showCommitmentStatus />
          </ErrorBoundary>
        ))}
      </Stack>

      {committedPetitions.length > 0 && canFetchMore && (
        <Stack justifyContent="center" alignItems="center" padding={{ top: 'md' }}>
          {isFetchingMore ? (
            <HoliLoader style={styles.loader} testID="next-page-loader" />
          ) : (
            <Button inline label="Load More" onPress={fetchMore} variant="primary" testID="load-more-button" />
          )}
        </Stack>
      )}
    </Stack>
  )
}

const stylesheet = createStyleSheet(() => ({
  loader: {
    padding: Spacing.xs,
  },
}))
