import React, { useEffect } from 'react'
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
import { VolunteeringRecoCardWithStatus } from '@holi/core/screens/userprofile/components/VolunteeringRecoCardWithStatus'
import { useCommittedVolunteering } from '@holi/core/screens/userprofile/hooks/useCommittedVolunteering'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import { Spacing } from 'holi-bricks/foundations'
import ErrorBoundary from '@holi/core/errors/components/ErrorBoundary'
import { useMyVolunteeringStatuses } from '@holi/core/screens/userprofile/hooks/useMyVolunteeringStatuses'
import { VolunteeringEmptyState } from '@holi/core/screens/userprofile/components/VolunteeringEmptyState'

const StatusInfoHeader = () => {
  const { t } = useTranslation()
  const { volunteeringStatuses } = useMyVolunteeringStatuses()
  const { show, hide, props: modalProps } = useModalState()

  return (
    <Stack alignItems="flex-end" padding={{ left: 'xs', right: 'xs', top: 'xs' }}>
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
              <Text size="3xl">{t('profile.myVolunteer.modal.title')}</Text>
              <Text size="md">{t('profile.myVolunteer.modal.description')}</Text>
            </Stack>

            <Stack gap="xs">
              {volunteeringStatuses.map(({ description, chip }) => (
                <Stack key={description} gap="4xs">
                  <ChipLabel {...chip} />
                  <Text size="md">{description}</Text>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </HoliModalContentWrapper>
      </HoliModal>
    </Stack>
  )
}

export const MyVolunteeringTab = () => {
  const { styles } = useStyles(stylesheet)
  const { items, canFetchMore, isFetchingMore, isLoading, isInitialLoad, fetchMore, totalResults, refetch } =
    useCommittedVolunteering()

  useEffect(() => {
    refetch()
  }, [refetch])

  if (isInitialLoad) {
    return (
      <Stack padding={{ top: '3xl' }}>
        <HoliLoader testID="initial-loader" style={styles.loader} />
      </Stack>
    )
  }

  if (!isLoading && totalResults === 0) {
    return (
      <Stack padding={{ top: '3xl', bottom: '3xl' }}>
        <VolunteeringEmptyState />
      </Stack>
    )
  }

  return (
    <Stack padding={{ bottom: 'xs' }}>
      <StatusInfoHeader />

      <Stack gap="xs" padding={{ top: 'xs' }}>
        {items.map((item) => (
          <ErrorBoundary key={item.id}>
            <VolunteeringRecoCardWithStatus engagement={item} />
          </ErrorBoundary>
        ))}
      </Stack>

      {items.length > 0 && canFetchMore && (
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
