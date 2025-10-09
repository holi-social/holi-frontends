import type React from 'react'
import { memo, useEffect } from 'react'
import { Screen } from '@holi/core/components/Screen'

import { useTaskDetailsData } from '@holi/core/screens/spaces/tasks/useTaskDetailsData/useTaskDetailsData'
import { BorderRadius, Spacing } from 'holi-bricks/foundations'
import { useTranslation } from 'react-i18next'
import { Text } from 'holi-bricks/components/text'
import SafeArea from '@holi/ui/components/atoms/SafeArea'
import { Platform, View } from 'react-native'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { StyleSheet } from 'react-native'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import { GoodDeedCounterCard } from '@holi/core/screens/spaces/tasks/components/GoodDeedCounterCard'
import { Close } from '@holi/icons/src/generated'
import { useWelcomeGoodDeedsCounterModal } from '@holi/core/screens/act/useDisplayWelcomeGoodDeedsCounterModal/useDisplayWelcomeGoodDeedsCounterModal'
import { setPathToRedirect } from '@holi/core/navigation/hooks/useRedirect'
import { useGetRewardsCounterQuery, useGlobalRewardsCounterQuery } from '@holi/api/graphql/graphql-codegen'
import { removeRedirectAfterSocialLogin } from '@holi/core/screens/spaces/tasks/helpers'
import { ButtonTracked } from '@holi/core/components/Trackable'
import { TrackingEvent } from '@holi/core/tracking'
import { useEarnedBadgesModal } from '@holi-apps/volunteering/components/VolunteeringProgressCard/EarnedBadgesModalProvider'
import { useFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import GoodDeedsCounterAnimation from '@holi/core/components/GoodDeedsCounterAnimation'

export type CompletedTaskParams = {
  taskId: string
}

const CompletedTask = () => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const styles = getStyles(theme)
  const { navigate } = useRouting()
  const welcomeGoodDeedsCounterModal = useWelcomeGoodDeedsCounterModal()
  const [badgesEnabled] = useFeatureFlag(FeatureFlagKey.BADGES)

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
    navigate('/')
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
      StickyBottomComponent={
        welcomeGoodDeedsCounterModal ? (
          <View style={styles.footer}>
            <HoliLocalImage
              imageSource={require('@holi/ui/assets/img/illustrations/campaignLogo.svg')}
              isSvg
              width={126}
              height={33}
              label={t('navigation.title')}
            />
            <Text size="sm">{t('tasks.register.success.brandSubtitle')}</Text>
            <ButtonTracked
              label={t('tasks.register.success.newUser.cta')}
              inline
              onPress={() => navigate('/act')}
              trackingEvent={TrackingEvent.Task.CTAButton.illDoIt({
                step: 'completed',
                authState: 'unregistered',
                ...taskProps,
              })}
            />
          </View>
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
              <View style={styles.cardContainer}>
                <GoodDeedCounterCard
                  imageSrc={data.coverImage?.uri}
                  title={data.title}
                  completedCount={totalCompletions}
                  totalCount={globalCounter}
                />
              </View>
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

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
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
    cardContainer: { marginTop: Spacing.xs, width: '100%' },
    counterContainer: { alignItems: 'center', width: '100%' },
    footer: {
      paddingBottom: Spacing.sm,
      gap: Spacing.xs,
      backgroundColor: theme.colors.brandB100,
      borderTopStartRadius: BorderRadius.xl,
      borderTopEndRadius: BorderRadius.xl,
      alignItems: 'center',
      padding: Spacing.xs,
    },
    footerWithoutWelcomeGoodDeedsCounterModal: {
      backgroundColor: 'transparent',
    },
    nativePadding: { paddingHorizontal: Platform.OS !== 'web' ? Spacing.xs : 0 },
  })

export default memo(CompletedTask)
