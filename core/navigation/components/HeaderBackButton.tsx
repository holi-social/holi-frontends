import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, ViewStyle } from 'react-native'

import { colors } from '@holi//ui/styles/globalVars'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliButton, { HoliButtonProps } from '@holi/ui/components/molecules/HoliButton'

export interface HeaderBackButtonProps extends Partial<HoliButtonProps> {
  label?: string
  tintColor?: string
  icon?: string
  style?: StyleProp<ViewStyle>
  testID?: string
}

const HeaderBackButton: React.VFC<HeaderBackButtonProps> = ({
  tintColor = colors.fontColorBlack,
  icon = 'arrow-left',
  ...props
}) => {
  const { navigateBack } = useUnifiedNavigation()
  const { t } = useTranslation()

  return (
    <HoliButton
      label={t('notifications.title')}
      inline
      transparent
      onPress={() => navigateBack()}
      testID="nav-button-back"
      {...props}
    >
      <HoliIcon icon={icon} size={24} color={tintColor} />
    </HoliButton>
  )
}

export default HeaderBackButton
