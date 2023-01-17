import React from 'react'
import { useTranslation } from 'react-i18next'
import { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

type MoreButtonProps = {
  icon?: string
  label?: string
  tintColor?: string
  style?: StyleProp<ViewStyle>
  onPress: (event: React.SyntheticEvent | GestureResponderEvent) => void
}

const MoreButton: React.VFC<MoreButtonProps> = ({
  label,
  icon = 'more',
  tintColor = colors.fontColorBlack,
  onPress,
  ...props
}: MoreButtonProps) => {
  const { t } = useTranslation()

  return (
    <HoliButton
      label={label || t('navigation.more')}
      inline
      transparent
      onPress={onPress}
      testID="nav-button-more"
      {...props}
    >
      <HoliIcon icon={icon} size={24} color={tintColor} />
    </HoliButton>
  )
}

export default MoreButton
