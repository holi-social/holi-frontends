import type React from 'react'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import { Trans, useTranslation } from 'react-i18next'
import { useSignupModal } from '@holi/core/providers/SignupModalProvider'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { TrackingEvent } from '@holi/core/tracking'
import { Text } from 'holi-bricks/components/text'
import { Pressable } from 'react-native'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { GoodDeeds, Information } from '@holi/icons/src/generated'
import { pill } from 'holi-bricks/components/chips/styles'
import { Spacing } from 'holi-bricks/foundations'

export const GoodDeedsChipGuest: React.FC = () => {
  const { styles } = useStyles(stylesheet)
  const { t } = useTranslation()
  const { requireLogin } = useSignupModal()
  const { track } = useTracking()

  const handlePress = () => {
    track(TrackingEvent.Rewards.goodDeedCounterChipClicked())
    requireLogin(() => {}, {
      title: t('personalGoodDeedCounter.drawer.guest.title'),
      description: t('personalGoodDeedCounter.drawer.guest.text'),
      subline: (
        <Trans
          i18nKey="personalGoodDeedCounter.drawer.campaignHint"
          components={{
            span: <Text />,
            b: <Text size="lg" />,
          }}
        />
      ),
      trackTrigger: 'COLLECT_GOOD_DEEDS',
    })
  }

  return (
    <Pressable
      onPress={handlePress}
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
