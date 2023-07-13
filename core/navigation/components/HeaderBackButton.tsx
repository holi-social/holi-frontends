import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, ViewStyle } from 'react-native'

import { colors } from '@holi//ui/styles/globalVars'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { HoliIconType } from '@holi/icons/src/HoliIconType'
import { ArrowLeft } from '@holi/icons/src/generated'
import HoliButton, { HoliButtonProps } from '@holi/ui/components/molecules/HoliButton'

export interface HeaderBackButtonProps extends Partial<HoliButtonProps> {
  label?: string
  tintColor?: string
  icon?: HoliIconType
  style?: StyleProp<ViewStyle>
  testID?: string
  onPress?: () => void
}

const HeaderBackButton: React.VFC<HeaderBackButtonProps> = ({
  tintColor = colors.foreground30,
  icon = ArrowLeft,
  onPress,
  ...props
}) => {
  const { navigateBack } = useRouting()
  const { t } = useTranslation()

  return (
    <HoliButton
      label={t('navigation.headerLeft.back')}
      inline
      transparent
      onPress={() => (onPress ? onPress() : navigateBack())}
      testID="nav-button-back"
      {...props}
    >
      <HoliIcon icon={icon} color={tintColor} />
    </HoliButton>
  )
}

export default HeaderBackButton
