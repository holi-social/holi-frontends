import { Text } from 'holi-bricks/components/text'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import { Spacing } from 'holi-bricks/foundations'
import React from 'react'
import { Pressable } from 'react-native'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Challenges, Draft, GoodDeeds, GoodDeedsV2, Hearts, Information } from '@holi/icons/src/generated'
import { Trans, useTranslation } from 'react-i18next'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import { Stack } from 'holi-bricks/components/stack'
import { pill } from 'holi-bricks/components/chips/styles'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { useSignupModal } from '@holi/core/providers/SignupModalProvider'
import { useGetRewardsCounterQuery } from '@holi/api/graphql/graphql-codegen'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { TrackingEvent } from '@holi/core/tracking'

const ChipGoodDeedsUser: React.FC = () => {
  const { styles } = useStyles(stylesheet)
  const { t } = useTranslation()
  const { isLoggedIn } = useLoggedInUser()
  const { requireLogin } = useSignupModal()
  const { track } = useTracking()

  const modalStateEmpty = useModalState() // modal for logged in users without any good deeds yet
  const modalStateDefault = useModalState() // modal for logged in users with at least one good deed

  const { data } = useGetRewardsCounterQuery()
  const counter = data?.rewards_counter?.counter ?? 0

  const showCorrectModal = () => {
    if (counter && counter > 0) {
      modalStateDefault.show()
    } else {
      modalStateEmpty.show()
    }
  }

  return (
    <>
      <Pressable
        onPress={() => {
          track(TrackingEvent.Rewards.goodDeedCounterChipClicked())
          requireLogin(showCorrectModal, {
            title: t('personalGoodDeedCounter.drawer.guest.title'),
            description: t('personalGoodDeedCounter.drawer.guest.text'),
            subline: (
              <Trans
                i18nKey="personalGoodDeedCounter.drawer.campaignHint"
                components={{
                  span: <Text size="md" />,
                  b: <Text size="lg" />,
                }}
              />
            ),
            trackTrigger: 'COLLECT_GOOD_DEEDS',
          })
        }}
        style={({ hovered, focused }) => [styles.chip(!!hovered, !!focused)]}
        testID="good-deeds-counter"
      >
        <HoliIcon icon={GoodDeeds} size={18} />
        {isLoggedIn && counter != 0 ? (
          <Text size="sm" selectable={false} testID="good-deeds-counter-value">
            {t('goodDeeds.name.count', { count: counter })}
          </Text>
        ) : (
          <Text size="sm" selectable={false}>
            {t('goodDeeds.name_other')}
          </Text>
        )}
        <HoliIcon icon={Information} size={18} />
      </Pressable>

      {/* modal for logged in users without any good deeds yet */}
      <HoliModal
        label={t('personalGoodDeedCounter.drawer.empty.h2')}
        onDismiss={modalStateEmpty.hide}
        shown={modalStateEmpty.visible}
        autoHeight
      >
        <HoliModalContentWrapper actionButtonText={t('modal.close')} onActionButtonPress={modalStateEmpty.hide}>
          <Stack gap="md" padding={{ bottom: 'md', left: 'md', right: 'md' }}>
            <Stack gap="3xs">
              <Text size="3xl">{t('personalGoodDeedCounter.drawer.empty.title')}</Text>
              <Text size="md">{t('personalGoodDeedCounter.drawer.empty.text')}</Text>
            </Stack>

            <Stack gap="xs">
              <Text size="xxl">{t('personalGoodDeedCounter.drawer.empty.h2')}</Text>

              <Stack gap="3xs">
                <Stack direction="row" gap="3xs">
                  <HoliIcon icon={Hearts} />
                  <Text size="md">{t('personalGoodDeedCounter.drawer.listItem.volunteering')}</Text>
                </Stack>

                <Stack direction="row" gap="3xs">
                  <HoliIcon icon={Challenges} />
                  <Text size="md">{t('personalGoodDeedCounter.drawer.listItem.challenges')}</Text>
                </Stack>

                <Stack direction="row" gap="3xs">
                  <HoliIcon icon={Draft} />
                  <Text size="md">{t('personalGoodDeedCounter.drawer.listItem.posts')}</Text>
                </Stack>
              </Stack>
            </Stack>

            <Text size="md">
              <Trans
                i18nKey="personalGoodDeedCounter.drawer.campaignHint"
                components={{
                  span: <Text size="md" />,
                  b: <Text size="md" bold />,
                }}
              />
            </Text>
          </Stack>
        </HoliModalContentWrapper>
      </HoliModal>

      {/* modal for logged in users with at least one good deed */}
      <HoliModal
        label={t('personalGoodDeedCounter.drawer.default.banner.title')}
        onDismiss={modalStateDefault.hide}
        shown={modalStateDefault.visible}
        autoHeight
      >
        <HoliModalContentWrapper actionButtonText={t('modal.close')} onActionButtonPress={modalStateDefault.hide}>
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
                  {counter} {t('goodDeeds.name', { count: counter })}
                </Text>
              </Stack>
            </Stack>

            <Stack gap="xs">
              <Text size="3xl">{t('personalGoodDeedCounter.drawer.empty.h2')}</Text>

              <Stack gap="3xs">
                <Stack direction="row" gap="3xs">
                  <HoliIcon icon={Hearts} />
                  <Text size="md">{t('personalGoodDeedCounter.drawer.listItem.volunteering')}</Text>
                </Stack>

                <Stack direction="row" gap="3xs">
                  <HoliIcon icon={Challenges} />
                  <Text size="md">{t('personalGoodDeedCounter.drawer.listItem.challenges')}</Text>
                </Stack>

                <Stack direction="row" gap="3xs">
                  <HoliIcon icon={Draft} />
                  <Text size="md">{t('personalGoodDeedCounter.drawer.listItem.posts')}</Text>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </HoliModalContentWrapper>
      </HoliModal>
    </>
  )
}

const ChipGoodDeedsGuest: React.FC = () => {
  const { styles } = useStyles(stylesheet)
  const { t } = useTranslation()
  const { requireLogin } = useSignupModal()
  const { track } = useTracking()

  return (
    <Pressable
      onPress={() => {
        track(TrackingEvent.Rewards.goodDeedCounterChipClicked())
        requireLogin(() => {}, {
          title: t('personalGoodDeedCounter.drawer.guest.title'),
          description: t('personalGoodDeedCounter.drawer.guest.text'),
          subline: (
            <Trans
              i18nKey="personalGoodDeedCounter.drawer.campaignHint"
              components={{
                span: <Text size="md" />,
                b: <Text size="lg" />,
              }}
            />
          ),
          trackTrigger: 'COLLECT_GOOD_DEEDS',
        })
      }}
      style={({ hovered, focused }) => [styles.chip(!!hovered, !!focused)]}
      testID="good-deeds-counter"
    >
      <HoliIcon icon={GoodDeeds} size={18} />
      <Text size="sm" selectable={false}>
        {t('goodDeeds.name_other')}
      </Text>
      <HoliIcon icon={Information} size={18} />
    </Pressable>
  )
}

export const ChipGoodDeeds: React.FC = () => {
  const { isLoggedIn } = useLoggedInUser()
  return isLoggedIn ? <ChipGoodDeedsUser /> : <ChipGoodDeedsGuest />
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
