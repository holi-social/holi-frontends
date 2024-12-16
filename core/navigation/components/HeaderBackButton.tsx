import type React from 'react'
import { useTranslation } from 'react-i18next'
import type { StyleProp, ViewStyle } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'
import { ArrowLeft } from '@holi/icons/src/generated'
import { ButtonIcon, type ButtonIconProps } from 'holi-bricks/components/button'

export interface HeaderBackButtonProps extends Partial<ButtonIconProps> {
  label?: string
  tintColor?: string
  icon?: HoliIconType
  style?: StyleProp<ViewStyle>
  testID?: string
  onPress?: () => void
}

const HeaderBackButton: React.FC<HeaderBackButtonProps> = ({ icon = ArrowLeft, onPress, ...props }) => {
  const { navigateBack } = useRouting()
  const { t } = useTranslation()

  return (
    <ButtonIcon
      label={t('navigation.headerLeft.back')}
      transparent
      onPress={() => (onPress ? onPress() : navigateBack())}
      testID="nav-button-back"
      icon={icon}
      size="lg"
      {...props}
    />
  )
}

export default HeaderBackButton
