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
import {
  type Rewards_RewardType,
  useGlobalRewardsCounterQuery,
  useGetRewardsCounterQuery,
  useRewardsTransactionsQuery,
} from '@holi/api/graphql/graphql-codegen'
import { GoodDeedsEmptyState } from '@holi/core/screens/userprofile/components/GoodDeedsEmptyState'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { GoodDeedsV2 } from '@holi/icons/src/generated'

export const GoodDeedsTab = () => {
  const { styles } = useStyles(stylesheet)
  const { t } = useTranslation()

  const { data: personalGoodDeeds, loading: personalGoodDeedsLoading } = useGetRewardsCounterQuery()
  const { data: globalGoodDeeds, loading: globalGoodDeedsLoading } = useGlobalRewardsCounterQuery()
  const { data: rewardTransactions } = useRewardsTransactionsQuery({
    variables: {
      offset: 0,
      limit: 10,
    },
    fetchPolicy: 'network-only',
  })

  const goodDeeds = rewardTransactions?.rewards_transactions.data || []
  const personalCounter = personalGoodDeeds?.rewards_counter?.counter ?? 0
  const globalCounter = globalGoodDeeds?.rewards_globalCounter.counter ?? 0
  const totalCounter = personalCounter + globalCounter

  const formatRewardType = (rewardType: Rewards_RewardType) => {
    switch (rewardType) {
      case 'ChallengeSubmitted':
        return t('goodDeed.history.challengeSubmitted')
      case 'GoodDeedPostCreated':
        return t('goodDeed.history.goodDeedPostCreated')
      case 'ExternalVolunteeringOpportunityStarted':
        return t('goodDeed.history.ExternalVolunteeringOpportunityStarted')
      default:
        return rewardType
    }
  }

  const formatRewardDate = (rewardDate: Date) => {
    const date = new Date(rewardDate)
    return date.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  if (personalGoodDeedsLoading || globalGoodDeedsLoading) {
    return (
      <Stack padding={{ top: '3xl' }}>
        <HoliLoader testID="initial-loader" style={styles.loader} />
      </Stack>
    )
  }
  if (!personalGoodDeedsLoading && !globalGoodDeedsLoading && personalCounter === 0) {
    return (
      <Stack padding={{ top: 'xs', bottom: 'xs' }} gap="xxs">
        <Text size="md">{t('profile.tabs.oneMioGoodDeeds.title')}</Text>

        <Stack justifyContent="center" backgroundColor="support" borderRadius="md" padding="3xs">
          <GoodDeedsBanner counter={totalCounter} />
        </Stack>

        <GoodDeedsEmptyState />
      </Stack>
    )
  }

  return (
    <Stack padding={{ top: 'xs', bottom: 'xs' }} gap="xxs">
      <Text size="md">{t('profile.tabs.oneMioGoodDeeds.title')}</Text>

      <Stack justifyContent="center" backgroundColor="support" borderRadius="md" padding="3xs" gap="md">
        <GoodDeedsBanner counter={totalCounter} />

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

        {/* list of good deeds */}
        <Stack>
          {goodDeeds.map((goodDeed) => (
            <ErrorBoundary key={goodDeed.id}>
              <Stack
                padding={{ top: '3xs', bottom: '3xs', left: 'xs', right: 'xs' }}
                gap="xxs"
                direction="row"
                justifyContent="space-between"
              >
                <Stack gap="4xs">
                  <Text size="md">{formatRewardType(goodDeed.rewardType)}</Text>
                  <Text size="xs" color="support">
                    {formatRewardDate(goodDeed.createdAt)}
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
