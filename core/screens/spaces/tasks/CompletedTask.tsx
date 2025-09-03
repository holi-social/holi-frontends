import React, { memo, useEffect } from 'react'
import { Screen } from '@holi/core/components/Screen'

import { useTaskDetailsData } from '@holi/core/screens/spaces/tasks/useTaskDetailsData/useTaskDetailsData'
import { BorderRadius, Spacing } from 'holi-bricks/foundations'
import { useTranslation } from 'react-i18next'
import { Text } from 'holi-bricks/components/text'
import SafeArea from '@holi/ui/components/atoms/SafeArea'
import { View } from 'react-native'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { StyleSheet } from 'react-native'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import { GoodDeedCounterCard } from 'holi-bricks/patterns/good-deed-card/GoodDeedCounterCard'
import { Close } from '@holi/icons/src/generated'
import { Button } from 'holi-bricks/components/button'
import { useWelcomeGoodDeedsCounter } from '@holi/core/screens/act/useDisplayWelcomeGoodDeedsCounter'
import { setPathToRedirect } from '@holi/core/navigation/hooks/useRedirect'
import { useGetRewardsCounterQuery } from '@holi/api/graphql/graphql-codegen'
import { removeRedirectAfterSocialLogin } from '@holi/core/screens/spaces/tasks/helpers'

export type CompletedTaskParams = {
  taskId: string
}

const CompletedTask = () => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const styles = getStyles(theme)
  const { navigate } = useRouting()
  const welcomeGoodDeedsCounter = useWelcomeGoodDeedsCounter()

  const { refetch, data, totalCompletions = 0 } = useTaskDetailsData()
  const { data: rewardsCounterData } = useGetRewardsCounterQuery()
  const count = rewardsCounterData?.rewards_counter?.counter ?? 1 // optimistic 1 in case the async counter still hasn't updated

  useEffect(() => {
    setPathToRedirect(null)
    removeRedirectAfterSocialLogin()
  }, [])

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
        welcomeGoodDeedsCounter ? (
          <View style={styles.footer}>
            <HoliLocalImage
              imageSource={require('@holi/ui/assets/img/illustrations/campaignLogo.svg')}
              isSvg
              width={126}
              height={33}
              label={t('navigation.title')}
            />
            <Text size="sm">{t('tasks.register.success.brandSubtitle')}</Text>
            <Button label={t('tasks.register.success.newUser.cta')} inline onPress={() => navigate('/act')} />
          </View>
        ) : (
          <View style={[styles.footer, styles.footerWithoutWelcomeGoodDeedsCounter]}>
            <Button label={t('goodDeed.rewardsMessage.button')} onPress={() => navigate('/act')} />
          </View>
        )
      }
    >
      <View style={styles.body}>
        <SafeArea>
          <HoliContainer>
            <View style={styles.container}>
              <Text size="3xl" textAlign="center">
                {t('tasks.register.success.title')}
              </Text>
              <View style={styles.cardContainer}>
                <GoodDeedCounterCard
                  imageSrc={data.coverImage?.uri}
                  title={data.title}
                  completedCount={totalCompletions}
                  totalCount={count}
                />
              </View>
              <View style={styles.counterContainer}>
                <HoliLocalImage
                  imageSource={require('@holi/ui/assets/img/illustrations/heartHandshake.svg')}
                  isSvg
                  width={126}
                  height={126}
                  label={t('navigation.title')}
                />
                <Text size="5xl" headingLevel="1" textAlign="center">
                  {t('goodDeedsCounter.static.+1')}
                </Text>
                <Text size="xxl" textAlign="center">
                  {t('goodDeedsCounter.label.single')}
                </Text>
              </View>
            </View>
          </HoliContainer>
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
    footerWithoutWelcomeGoodDeedsCounter: {
      backgroundColor: 'transparent',
    },
  })

export default memo(CompletedTask)
