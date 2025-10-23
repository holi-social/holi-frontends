import type React from 'react'
import { memo, useEffect } from 'react'
import { Screen } from '@holi/core/components/Screen'

import { useTaskDetailsData } from '@holi/core/screens/spaces/tasks/useTaskDetailsData/useTaskDetailsData'
import { BorderRadius, Spacing } from 'holi-bricks/foundations'
import { useTranslation } from 'react-i18next'
import { Text } from 'holi-bricks/components/text'
import SafeArea from '@holi/ui/components/atoms/SafeArea'
import { Platform, View, type ViewProps } from 'react-native'
import { useTheme } from '@holi/ui/styles/theme'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { GoodDeedCounterCard } from '@holi/core/screens/spaces/tasks/components/GoodDeedCounterCard'
import { Close } from '@holi/icons/src/generated'
import {
  storeWelcomeGoodDeedsCounterModal,
  useWelcomeGoodDeedsCounterModal,
} from '@holi/core/screens/act/useDisplayWelcomeGoodDeedsCounterModal/useDisplayWelcomeGoodDeedsCounterModal'
import { setPathToRedirect } from '@holi/core/navigation/hooks/useRedirect'
import { useGetRewardsCounterQuery, useGlobalRewardsCounterQuery } from '@holi/api/graphql/graphql-codegen'
import { removeRedirectAfterSocialLogin } from '@holi/core/screens/spaces/tasks/helpers'
import { ButtonTracked } from '@holi/core/components/Trackable'
import { TrackingEvent } from '@holi/core/tracking'
import { useEarnedBadgesModal } from '@holi-apps/volunteering/components/VolunteeringProgressCard/EarnedBadgesGlobalModal'
import { useFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import GoodDeedsCounterAnimation from '@holi/core/components/GoodDeedsCounterAnimation'
import { Stack } from 'holi-bricks/components/stack'
import { Image } from 'holi-bricks/components/image'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { showGoodDeedsIntroModal } from '@holi/core/screens/onboarding/components/GoodDeedsIntroModal/helpers/useGoodDeedsIntroModalState'
import { useUnseenImpactStarterBadge } from '@holi/core/screens/onboarding/components/GoodDeedsIntroModal/helpers/useUnseenImpactStarterBadge'

export type CompletedTaskParams = {
  taskId: string
}

const CompletedTask = () => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const { styles } = useStyles(stylesheet)
  const { navigate } = useRouting()
  const welcomeGoodDeedsCounterModal = useWelcomeGoodDeedsCounterModal()
  const [badgesEnabled] = useFeatureFlag(FeatureFlagKey.BADGES)
  const { impactStarterBadge, loading: loadingUnseenImpactStarterBadge } = useUnseenImpactStarterBadge()

  const {
    refetch,
    data,
    totalCompletions = 0,
    taskDuration,
    taskRegularity,
    interactionType,
    id,
  } = useTaskDetailsData()

  const taskProps = {
    taskId: id ?? '',
    taskName: data?.title,
    regularity: taskRegularity,
    duration: taskDuration,
    interactionType,
  }

  const { data: rewardsData } = useGetRewardsCounterQuery({ fetchPolicy: 'no-cache' })
  const { data: globalRewardsData } = useGlobalRewardsCounterQuery()
  const counter = rewardsData?.rewards_counter.counter ?? 0
  const globalCounter = globalRewardsData?.rewards_globalCounter?.counter ?? 0
  const labelText = t('goodDeeds.name', { count: counter })
  const checkNewBadges = useEarnedBadgesModal()

  useEffect(() => {
    setPathToRedirect(null)
    removeRedirectAfterSocialLogin()
  }, [])

  const handleClaimReward = async () => {
    if (badgesEnabled) {
      await checkNewBadges()
    }
    navigate('/act')
  }

  const showGoodDeedsIntroOnActPage = () => {
    showGoodDeedsIntroModal('first-tracked-good-deed')
    storeWelcomeGoodDeedsCounterModal(false)
    navigate('/act')
  }

  return (
    <Screen
      onRefresh={refetch}
      preset="scroll"
      keyboardShouldPersistTaps="always"
      headerOptions={{
        headerBackVisible: false,
        headerLeft: () => <></>,
        headerRight: () => <HeaderBackButton icon={Close} onPress={() => navigate('/act')} />,
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: theme.colors.background20,
        },
        title: '',
        navigationCustomOptions: {
          footerShown: false,
        },
      }}
      noContainerPaddingWeb
      StickyBottomComponent={
        welcomeGoodDeedsCounterModal ? (
          <HoliContainer noPaddingOnSmallViewports>
            <Stack
              backgroundColor="yellowDefault"
              borderRadius={{ topLeft: 'lg', topRight: 'lg' }}
              padding={{ top: 'md', bottom: 'md', left: 'xs', right: 'xs' }}
              alignItems="center"
            >
              <Stack maxWidth="sm" gap="xxs" alignItems="center">
                <Text size="xxl" textAlign="center">
                  {t('tasks.register.success.brandSubtitle')}
                </Text>

                <Stack direction="row" backgroundColor="yellowLight" gap="3xs" padding="xs" borderRadius="xxs">
                  <Image
                    source={require('@holi/ui/assets/img/badges/badge-impact-starter.svg')}
                    width={56}
                    height={64}
                    alt={t('badge.name.volunteering.starter')}
                  />

                  <Stack flexShrink={1} gap="3xs">
                    <Text bold>{t('badge.name.volunteering.starter')}</Text>

                    <Text>{t('tasks.register.success.badgeDescription')}</Text>
                  </Stack>
                </Stack>

                <View style={styles.claimButtonContainer}>
                  <ButtonTracked
                    loading={loadingUnseenImpactStarterBadge}
                    label={t('goodDeed.rewardsMessage.button')}
                    onPress={impactStarterBadge ? showGoodDeedsIntroOnActPage : handleClaimReward}
                    trackingEvent={TrackingEvent.Task.CTAButton.illDoIt({
                      step: 'completed',
                      authState: 'unregistered',
                      ...taskProps,
                    })}
                  />
                </View>
              </Stack>
            </Stack>
          </HoliContainer>
        ) : (
          <View style={[styles.footer, styles.footerWithoutWelcomeGoodDeedsCounterModal]}>
            <ButtonTracked
              label={t('goodDeed.rewardsMessage.button')}
              onPress={handleClaimReward}
              trackingEvent={TrackingEvent.Task.CTAButton.illDoIt({
                step: 'completed',
                authState: 'registered',
                ...taskProps,
              })}
            />
          </View>
        )
      }
    >
      <View style={styles.body}>
        <SafeArea>
          <View style={styles.nativePadding}>
            <View style={styles.container}>
              <Text size="3xl" textAlign="center">
                {t('tasks.register.success.title')}
              </Text>
              <HoliContainer>
                <View style={[styles.cardContainer]}>
                  <GoodDeedCounterCard
                    imageSrc={data.coverImage?.uri}
                    title={data.title}
                    completedCount={totalCompletions}
                    totalCount={globalCounter}
                  />
                </View>
              </HoliContainer>
              <View style={styles.counterContainer}>
                <GoodDeedsCounterAnimation
                  deedCount={counter}
                  labelText={labelText}
                  testID="completed-task-good-deeds-counter-animation"
                  counterTestID="completed-task-good-deeds-counter-final"
                  labelTestID="completed-task-good-deeds-counter-label"
                />
              </View>
            </View>
          </View>
        </SafeArea>
      </View>
    </Screen>
  )
}

const stylesheet = createStyleSheet(() => ({
  body: {
    borderBottomStartRadius: BorderRadius.xl,
    borderBottomEndRadius: BorderRadius.xl,
    paddingBottom: Spacing['xxs'],
  },
  container: {
    gap: Spacing['3xs'],
    marginBottom: Spacing.xs,
    alignItems: 'center',
  },
  cardContainer: {
    marginTop: Spacing.xs,
    width: '100%',
  },
  counterContainer: {
    alignItems: 'center',
    width: '100%',
  },
  footer: {
    paddingBottom: Spacing.sm,
    gap: Spacing.xs,
    borderTopStartRadius: BorderRadius.xl,
    borderTopEndRadius: BorderRadius.xl,
    alignItems: 'center',
    padding: Spacing.xs,
  },
  footerWithoutWelcomeGoodDeedsCounterModal: {
    backgroundColor: 'transparent',
  },
  nativePadding: {
    paddingHorizontal: Platform.OS !== 'web' ? Spacing.xs : 0,
  },
  claimButtonContainer: {
    width: {
      zero: '100%',
      md: 200,
    },
  } as ViewProps,
}))

export default memo(CompletedTask)
