import type React from 'react'
import { useTranslation } from 'react-i18next'

import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'

import VolunteeringListingSkeleton from '@holi-apps/volunteering/components/VolunteeringListingSkeleton'

import { Button } from 'holi-bricks/components/button'
import type { LocalizedTypesenseDocument } from '@holi/core/typesense/types'
import { VolunteeringRecoCard } from '@holi-apps/volunteering/components/VolunteeringRecoCard'
import { Spacing } from 'holi-bricks/foundations'
import { Text } from 'holi-bricks/components/text'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { Stack } from 'holi-bricks/components/stack'
import HoliLottie from '@holi/ui/components/atoms/HoliLottie'
import { Delete } from '@holi/icons/src/generated'

export const ENGAGEMENT_PAGE_SIZE = 10

interface VolunteeringEngagementListProps {
  isFiltering?: boolean
  loadingFailed?: boolean
  clearFilters?: () => void
  engagements: LocalizedTypesenseDocument[]
  isLoading?: boolean
  totalResults?: number
  footerComponent?: React.ReactNode
}

export const VolunteeringEngagementList = ({
  loadingFailed = false,
  isFiltering = false,
  clearFilters,
  engagements,
  isLoading = false,
  totalResults = 0,
  footerComponent,
}: VolunteeringEngagementListProps) => {
  const { t } = useTranslation()

  const noResults = loadingFailed || engagements.length === 0

  if (isLoading && !engagements.length) {
    return <VolunteeringListingSkeleton isFiltering={isFiltering} amount={ENGAGEMENT_PAGE_SIZE} />
  }

  if (noResults) {
    return (
      <HoliContainer>
        <Stack gap="3xs">
          <Stack direction="row" gap="xs" padding={{ bottom: 'md' }}>
            <Stack width={60} height={120}>
              <HoliLottie animType="noSearchResults" />
            </Stack>
            <Stack flex={1} justifyContent="center" gap="4xs">
              <Text size="lg">{t('volunteering.listing.nothingFound.title')}</Text>
              <Text size="sm">{t('volunteering.listing.nothingFound.subtitle')}</Text>
            </Stack>
          </Stack>

          <Button label={t('search.filter.reset', { count: 2 })} onPress={clearFilters} icon={Delete} />
        </Stack>
      </HoliContainer>
    )
  }

  return (
    <HoliContainer>
      {isFiltering ? (
        <Text size="md" color="support" margin={{ bottom: 'xxs' }}>
          {t('volunteering.filter.result', {
            count: totalResults,
          })}
        </Text>
      ) : (
        <Text size="xxl" margin={{ bottom: 'xxs' }}>
          {t('volunteering.recommended.title')}
        </Text>
      )}
      <Stack
        padding={{ bottom: 'md' }}
        testID={isFiltering ? 'volunteering-list-filtered' : 'volunteering-list-unfiltered'}
      >
        <HoliGridWrapper gap={Spacing['3xs']}>
          {engagements.map((engagement, index) => {
            return (
              <HoliGridCell key={engagement.id}>
                <VolunteeringRecoCard engagement={engagement} index={index} fixedWidth="100%" />
              </HoliGridCell>
            )
          })}
        </HoliGridWrapper>
      </Stack>
      {footerComponent}
    </HoliContainer>
  )
}
