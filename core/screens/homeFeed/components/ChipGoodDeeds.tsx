import { Text } from 'holi-bricks/components/text'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import { Spacing } from 'holi-bricks/foundations'
import React from 'react'
import { Pressable } from 'react-native'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ChallengesFilled, DraftFilled, GoodDeeds, GoodDeedsV2, Information } from '@holi/icons/src/generated'
import { Trans, useTranslation } from 'react-i18next'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import { Stack } from 'holi-bricks/components/stack'
import { pill } from 'holi-bricks/components/chips/styles'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { useSignupModal } from '@holi/core/providers/SignupModalProvider'

type ChipGoodDeedsProps = {
  counter?: number
}

export const ChipGoodDeeds = ({ counter }: ChipGoodDeedsProps) => {
  const { styles } = useStyles(stylesheet)
  const { t } = useTranslation()
  const { isLoggedIn } = useLoggedInUser()
  const { openSignupModal } = useSignupModal()

  const modalStateEmpty = useModalState() // modal for logged in users without any good deeds yet
  const modalStateDefault = useModalState() // modal for logged in users with at least one good deed

  const showCorrectModal = () => {
    if (!isLoggedIn) {
      safelyOpenSignupModal()
    } else if (counter && counter > 0) {
      modalStateDefault.show()
    } else {
      modalStateEmpty.show()
    }
  }

  const safelyOpenSignupModal = () => {
    openSignupModal({
      title: t('personalGoodDeedCounter.drawer.guest.title'),
      description: t('personalGoodDeedCounter.drawer.guest.text'),
      secondDescription: (
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
  }

  return (
    <>
      <Pressable onPress={showCorrectModal} style={({ hovered, focused }) => [styles.chip(!!hovered, !!focused)]}>
        <HoliIcon icon={GoodDeeds} size={18} />
        <Text size="sm" selectable={false}>
          {counter && counter > 0 ? `${counter} ${t('personalGoodDeedCounter.label')}` : t('goodDeeds.name')}
        </Text>
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
                  <HoliIcon icon={ChallengesFilled} />
                  <Text size="md">{t('personalGoodDeedCounter.drawer.listItem.challenges')}</Text>
                </Stack>

                <Stack direction="row" gap="3xs">
                  <HoliIcon icon={DraftFilled} />
                  <Text size="md">{t('personalGoodDeedCounter.drawer.listItem.posts')}</Text>
                </Stack>
              </Stack>
            </Stack>

            <Text size="md">
              <Trans
                i18nKey="personalGoodDeedCounter.drawer.campaignHint"
                components={{
                  span: <span />,
                  b: <b />,
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
                  {counter} {t('goodDeeds.name')}
                </Text>
              </Stack>
            </Stack>

            <Stack gap="xs">
              <Text size="3xl">{t('personalGoodDeedCounter.drawer.empty.h2')}</Text>

              <Stack gap="3xs">
                <Stack direction="row" gap="3xs">
                  <HoliIcon icon={ChallengesFilled} />
                  <Text size="md">{t('personalGoodDeedCounter.drawer.listItem.challenges')}</Text>
                </Stack>

                <Stack direction="row" gap="3xs">
                  <HoliIcon icon={DraftFilled} />
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
