import React from 'react'
import { useTranslation } from 'react-i18next'

import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import { useTheme } from '@holi/ui/styles/theme'

const HoliLogo = () => {
  const { theme } = useTheme()
  const { t } = useTranslation()

  return theme.dark ? (
    <HoliLocalImage
      imageSource={require('@holi/ui/assets/img/holi/holi_white.svg')}
      isSvg
      width={56}
      height={24}
      label={t('navigation.title')}
    />
  ) : (
    <HoliLocalImage
      imageSource={require('@holi/ui/assets/img/holi/holi.svg')}
      isSvg
      width={56}
      height={24}
      label={t('navigation.title')}
    />
  )
}

export default HoliLogo
