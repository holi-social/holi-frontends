import type React from 'react'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import { Trans, useTranslation } from 'react-i18next'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { useGetRewardsCounterQuery } from '@holi/api/graphql/graphql-codegen'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { Stack } from 'holi-bricks/components/stack'
import { Text } from 'holi-bricks/components/text'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Challenges, Draft, GoodDeeds, GoodDeedsV2, Hearts, Information } from '@holi/icons/src/generated'
import { TrackingEvent } from '@holi/core/tracking'
import { Pressable } from 'react-native'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import { pill } from 'holi-bricks/components/chips/styles'
import { Spacing } from 'holi-bricks/foundations'

export const CounterModalContent = ({ count }: { count: number }) => {
  const { t } = useTranslation()

  return (
    <Stack gap="md" padding={{ bottom: 'md', left: 'md', right: 'md' }}>
      <Stack
        gap="4xs"
        padding="xs"
        backgroundColor="blueLight"
        borderRadius="xs"
        borderStyle="solid"
        borderColor="main"
        borderWidth="sm"
        alignItems="center"
      >
        <Text size="xl">{t('personalGoodDeedCounter.drawer.default.banner.title')}</Text>
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
            {count} {t('goodDeeds.name', { count: count })}
          </Text>
        </Stack>
      </Stack>

      <Stack gap="xs">
        <Text size="3xl">{t('personalGoodDeedCounter.drawer.empty.h2')}</Text>

        <Stack gap="3xs">
          <Stack direction="row" gap="3xs">
            <HoliIcon icon={Hearts} />
            <Text>{t('personalGoodDeedCounter.drawer.listItem.volunteering')}</Text>
          </Stack>

          <Stack direction="row" gap="3xs">
            <HoliIcon icon={Challenges} />
            <Text>{t('personalGoodDeedCounter.drawer.listItem.challenges')}</Text>
          </Stack>

          <Stack direction="row" gap="3xs">
            <HoliIcon icon={Draft} />
            <Text>{t('personalGoodDeedCounter.drawer.listItem.posts')}</Text>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}

export const GoodDeedsChipUser: React.FC = () => {
  const { styles } = useStyles(stylesheet)
  const { t } = useTranslation()
  const { track } = useTracking()

  const { data } = useGetRewardsCounterQuery()
  const count = data?.rewards_counter?.counter ?? 0
  const hasDeed = count && count > 0

  const modalState = useModalState()

  const CountModal = {
    title: t('personalGoodDeedCounter.drawer.default.banner.title'),
    content: <CounterModalContent count={count} />,
  }

  const TeaserModal = {
    title: t('personalGoodDeedCounter.drawer.empty.h2'),
    content: (
      <Stack gap="md" padding={{ bottom: 'md', left: 'md', right: 'md' }}>
        <Stack gap="3xs">
          <Text size="3xl">{t('personalGoodDeedCounter.drawer.empty.title')}</Text>
          <Text>{t('personalGoodDeedCounter.drawer.empty.text')}</Text>
        </Stack>

        <Stack gap="xs">
          <Text size="xxl">{t('personalGoodDeedCounter.drawer.empty.h2')}</Text>

          <Stack gap="3xs">
            <Stack direction="row" gap="3xs">
              <HoliIcon icon={Hearts} />
              <Text>{t('personalGoodDeedCounter.drawer.listItem.volunteering')}</Text>
            </Stack>

            <Stack direction="row" gap="3xs">
              <HoliIcon icon={Challenges} />
              <Text>{t('personalGoodDeedCounter.drawer.listItem.challenges')}</Text>
            </Stack>

            <Stack direction="row" gap="3xs">
              <HoliIcon icon={Draft} />
              <Text>{t('personalGoodDeedCounter.drawer.listItem.posts')}</Text>
            </Stack>
          </Stack>
        </Stack>

        <Text>
          <Trans
            i18nKey="personalGoodDeedCounter.drawer.campaignHint"
            components={{
              span: <Text />,
              b: <Text bold />,
            }}
          />
        </Text>
      </Stack>
    ),
  }

  const handlePress = () => {
    track(TrackingEvent.Rewards.goodDeedCounterChipClicked())
    modalState.show()
  }

  return (
    <>
      <Pressable
        onPress={handlePress}
        style={({ hovered, focused }) => [styles.chip(!!hovered, !!focused)]}
        testID="good-deeds-counter"
      >
        <HoliIcon icon={GoodDeeds} size={18} />
        {count != 0 ? (
          <Text size="sm" selectable={false} testID="good-deeds-counter-value">
            {t('goodDeeds.name.count', { count: count })}
          </Text>
        ) : (
          <Text size="sm" selectable={false}>
            {t('goodDeeds.name_other')}
          </Text>
        )}
        <HoliIcon icon={Information} size={18} />
      </Pressable>

      <HoliModal {...modalState.props} label={hasDeed ? CountModal.title : TeaserModal.title} autoHeight>
        <HoliModalContentWrapper actionButtonText={t('modal.close')} onActionButtonPress={modalState.props.onDismiss}>
          {hasDeed ? CountModal.content : TeaserModal.content}
        </HoliModalContentWrapper>
      </HoliModal>
    </>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  chip: (hovered: boolean, focused: boolean) => {
    return {
      ...pill,
      backgroundColor: theme.colors.bg.support,
      borderColor: theme.colors.border.support,
      borderWidth: 1,
      outlineColor: theme.colors.border.main,
      outlineWidth: 1,
      outlineStyle: hovered ? 'solid' : 'none',
      boxShadow: focused ? theme.colors.focus : 'none',
      paddingHorizontal: Spacing['3xs'],
      minHeight: Spacing.lg,
    }
  },
}))
