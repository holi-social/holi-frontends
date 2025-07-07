import { Text } from 'holi-bricks/components/text'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import { Spacing } from 'holi-bricks/foundations'
import React from 'react'
import { Pressable } from 'react-native'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { pill } from './styles'
import { GoodDeeds, Information } from '@holi/icons/src/generated'
import { useTranslation } from 'react-i18next'

type ChipGoodDeedsProps = {
  counter?: number
}

export const ChipGoodDeeds = ({ counter = 0 }: ChipGoodDeedsProps) => {
  const { styles } = useStyles(stylesheet)
  const { t } = useTranslation()

  return (
    <Pressable onPress={() => {}} style={({ hovered, focused }) => [styles.chip(!!hovered, !!focused)]}>
      <HoliIcon icon={GoodDeeds} size={18} />
      <Text size="sm" selectable={false}>
        {counter > 0 ? `${counter} ${t('personalGoodDeedCounter.label')}` : t('goodDeeds.name')}
      </Text>
      <HoliIcon icon={Information} size={18} />
    </Pressable>
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
