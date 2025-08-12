import React from 'react'
import { Stack } from 'holi-bricks/components/stack'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import { Spacing } from 'holi-bricks/foundations'
import ErrorBoundary from '@holi/core/errors/components/ErrorBoundary'
import { GoodDeedsBanner } from '@holi/core/screens/userprofile/components/GoodDeedsBanner'
import { useTranslation } from 'react-i18next'
import { Text } from 'holi-bricks/components/text'
import { ChipLabel } from 'holi-bricks/components/chips'
import { useGetRewardsCounterQuery } from '@holi/api/graphql/graphql-codegen'
import { GoodDeedsEmptyState } from '@holi/core/screens/userprofile/components/GoodDeedsEmptyState'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { CalendarEventLine, GoodDeedsV2 } from '@holi/icons/src/generated'

export const GoodDeedsTab = () => {
  const { styles } = useStyles(stylesheet)
  const { t } = useTranslation()

  const { data, loading } = useGetRewardsCounterQuery()
  const personalCounter = data?.rewards_counter?.counter ?? 0
  const globalCounter = personalCounter // todo: add the amount of good deeds from backoffice
  const items = [
    { id: '1', type: 'Good Deed Post', date: '2023-10-01' },
    { id: '2', type: 'Joined a challenge', date: '2023-10-02' },
    { id: '3', type: 'Joined a challenge', date: '2023-10-03' },
  ] // todo: replace with actual data
  const daysLeft = 30 // todo: replace with actual calculation

  if (loading) {
    return (
      <Stack padding={{ top: '3xl' }}>
        <HoliLoader testID="initial-loader" style={styles.loader} />
      </Stack>
    )
  }

  if (!loading && globalCounter === 0) {
    return (
      <Stack padding={{ top: 'xs', bottom: 'xs' }} gap="xxs">
        <Stack direction="row" alignContent="center" justifyContent="space-between">
          <Stack justifyContent="center">
            <Text size="md" textAlign="center">
              {t('profile.tabs.oneMioGoodDeeds.title')}
            </Text>
          </Stack>

          <ChipLabel color="white" iconLeading={CalendarEventLine}>
            {t('oneMioGoodDeeds.daysLeft', { count: daysLeft })}
          </ChipLabel>
        </Stack>

        <Stack justifyContent="center" backgroundColor="support" borderRadius="md" padding="3xs">
          <GoodDeedsBanner goodDeedsCounter={personalCounter} />
        </Stack>

        <GoodDeedsEmptyState />
      </Stack>
    )
  }

  return (
    <Stack padding={{ top: 'xs', bottom: 'xs' }} gap="xxs">
      <Stack direction="row" alignContent="center" justifyContent="space-between">
        <Stack justifyContent="center">
          <Text size="md" textAlign="center">
            {t('profile.tabs.oneMioGoodDeeds.title')}
          </Text>
        </Stack>

        <ChipLabel color="white">{t('oneMioGoodDeeds.daysLeft')}</ChipLabel>
      </Stack>

      <Stack justifyContent="center" backgroundColor="support" borderRadius="md" padding="3xs" gap="md">
        <GoodDeedsBanner goodDeedsCounter={personalCounter} />

        {/* blue box */}
        <Stack gap="4xs" padding="xs" backgroundColor="blueLight" borderRadius="md" alignItems="center">
          <Text size="xl">{t('profile.tabs.oneMioGoodDeeds.personalGoodDeedsCounter.title')}</Text>

          <Stack
            borderRadius="pill"
            backgroundColor="support"
            direction="row"
            alignItems="center"
            gap="4xs"
            padding={{ top: '4xs', bottom: '4xs', left: 'xs', right: 'xs' }}
            borderColor="main"
            borderStyle="solid"
            borderWidth="sm"
          >
            <HoliIcon icon={GoodDeedsV2} size={40} />
            <Text size="xxl" selectable={false}>
              {personalCounter} {t('goodDeeds.name', { count: personalCounter })}
            </Text>
          </Stack>
        </Stack>

        {/* list */}
        <Stack>
          {items.map((item) => (
            <ErrorBoundary key={item.id}>
              <Stack
                padding={{ top: '3xs', bottom: '3xs', left: 'xs', right: 'xs' }}
                gap="xxs"
                direction="row"
                justifyContent="space-between"
              >
                <Stack gap="4xs">
                  <Text size="md">{item.type}</Text>
                  <Text size="xs" color="support">
                    {item.date}
                  </Text>
                </Stack>
                <Stack alignSelf="center">
                  <ChipLabel color="green">+1</ChipLabel>
                </Stack>
              </Stack>
            </ErrorBoundary>
          ))}
        </Stack>
      </Stack>
    </Stack>
  )
}

const stylesheet = createStyleSheet(() => ({
  loader: {
    padding: Spacing.xs,
  },
}))
