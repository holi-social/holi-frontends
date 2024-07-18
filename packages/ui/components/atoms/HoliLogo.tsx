import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { HoliNameLogo } from '@holi/icons/src/generated'
import { useTheme } from '@holi/ui/styles/theme'

const HoliLogo = () => {
  const { theme } = useTheme()
  const { t } = useTranslation()

  return (
    <View aria-label={t('navigation.title')}>
      <HoliIcon
        icon={HoliNameLogo}
        size={{ width: 56, height: 24 }}
        color={theme.dark ? theme.colors.white100 : theme.colors.black300}
      />
    </View>
  )
}

export default HoliLogo
