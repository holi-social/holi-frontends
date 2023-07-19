import React from 'react'
import { useTranslation } from 'react-i18next'
import { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { HoliIconType } from '@holi/icons/src/HoliIconType'
import { More } from '@holi/icons/src/generated'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

type MoreButtonProps = {
  icon?: HoliIconType
  label?: string
  tintColor?: string
  style?: StyleProp<ViewStyle>
  onPress: (event: React.SyntheticEvent | GestureResponderEvent) => void
}

const MoreButton: React.VFC<MoreButtonProps> = ({
  label,
  icon = More,
  tintColor = colors.foreground30,
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
      <HoliIcon icon={icon} color={tintColor} />
    </HoliButton>
  )
}

export default MoreButton
