import type React from 'react'
import { useTranslation } from 'react-i18next'
import type { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native'

import type { HoliIconType } from '@holi/icons/src/HoliIconType'
import { More } from '@holi/icons/src/generated'
import { ButtonIcon } from 'holi-bricks/components/button'

type MoreButtonProps = {
  icon?: HoliIconType
  label?: string
  tintColor?: string
  style?: StyleProp<ViewStyle>
  onPress: (event: React.SyntheticEvent | GestureResponderEvent) => void
}

const MoreButton: React.FC<MoreButtonProps> = ({ label, icon = More, onPress, ...props }: MoreButtonProps) => {
  const { t } = useTranslation()

  return (
    <ButtonIcon
      label={label || t('navigation.more')}
      transparent
      onPress={onPress}
      testID="nav-button-more"
      icon={icon}
      size="lg"
      {...props}
    />
  )
}

export default MoreButton
