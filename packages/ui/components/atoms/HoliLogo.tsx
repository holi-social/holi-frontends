import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { HoliNameLogo } from '@holi/icons/src/generated'
import { useTheme } from '@holi/ui/styles/theme'

interface Props {
  color?: string
}

const HoliLogo = ({ color }: Props) => {
  const {
    theme: { colors },
  } = useTheme()
  color = color ?? colors.foreground20
  const { t } = useTranslation()

  return (
    <View aria-label={t('navigation.title')}>
      <HoliIcon icon={HoliNameLogo} size={{ width: 56, height: 24 }} color={color} />
    </View>
  )
}

export default HoliLogo
