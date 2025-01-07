import React from 'react'
import { useTranslation } from 'react-i18next'
import { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { HoliIconType } from '@holi/icons/src/HoliIconType'
import { More } from '@holi/icons/src/generated'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { useTheme } from '@holi/ui/styles/theme'

type MoreButtonProps = {
  icon?: HoliIconType
  label?: string
  tintColor?: string
  style?: StyleProp<ViewStyle>
  onPress: (event: React.SyntheticEvent | GestureResponderEvent) => void
}

const MoreButton: React.FC<MoreButtonProps> = ({
  label,
  icon = More,
  tintColor,
  onPress,
  ...props
}: MoreButtonProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { colors } = theme

  return (
    <HoliButton
      label={label || t('navigation.more')}
      inline
      transparent
      onPress={onPress}
      testID="nav-button-more"
      {...props}
    >
      <HoliIcon icon={icon} color={tintColor || colors.foreground30} />
    </HoliButton>
  )
}

export default MoreButton
