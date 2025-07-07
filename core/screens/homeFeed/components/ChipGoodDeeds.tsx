import { Text } from 'holi-bricks/components/text'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import { Spacing } from 'holi-bricks/foundations'
import React from 'react'
import { Pressable } from 'react-native'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ChallengesFilled, DraftFilled, GoodDeeds, Information } from '@holi/icons/src/generated'
import { Trans, useTranslation } from 'react-i18next'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import { Stack } from 'holi-bricks/components/stack'
import { pill } from 'holi-bricks/components/chips/styles'

type ChipGoodDeedsProps = {
  counter?: number
}

export const ChipGoodDeeds = ({ counter = 0 }: ChipGoodDeedsProps) => {
  const { styles } = useStyles(stylesheet)
  const { t } = useTranslation()

  const modalState = useModalState()

  return (
    <>
      <Pressable onPress={modalState.show} style={({ hovered, focused }) => [styles.chip(!!hovered, !!focused)]}>
        <HoliIcon icon={GoodDeeds} size={18} />
        <Text size="sm" selectable={false}>
          {counter > 0 ? `${counter} ${t('personalGoodDeedCounter.label')}` : t('goodDeeds.name')}
        </Text>
        <HoliIcon icon={Information} size={18} />
      </Pressable>

      <HoliModal label={'Filter Events'} {...modalState} shown={modalState.visible} autoHeight>
        <HoliModalContentWrapper actionButtonText={t('global.gotIt')} onActionButtonPress={() => {}}>
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
                i18nKey="personalGoodDeedCounter.drawer.guest.campaignHint"
                components={{
                  span: <span />,
                  b: <b />,
                }}
              />
            </Text>
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
      borderColor: theme.colors.border.support,
      borderWidth: 1,
      outlineColor: theme.colors.border.main,
      outlineWidth: 1,
      outlineStyle: hovered ? 'solid' : 'none',
      boxShadow: focused ? theme.colors.focus : 'none',
      alignSelf: 'flex-start',
      paddingHorizontal: Spacing['3xs'],
      minHeight: Spacing.lg,
    }
  },
}))
