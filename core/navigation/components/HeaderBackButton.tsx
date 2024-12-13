import type React from 'react'
import { useTranslation } from 'react-i18next'
import type { StyleProp, ViewStyle } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'
import { ArrowLeft } from '@holi/icons/src/generated'
import HoliButton, { type HoliButtonProps } from '@holi/ui/components/molecules/HoliButton'
import { useTheme } from '@holi/ui/styles/theme'

export interface HeaderBackButtonProps extends Partial<HoliButtonProps> {
  label?: string
  tintColor?: string
  icon?: HoliIconType
  style?: StyleProp<ViewStyle>
  testID?: string
  onPress?: () => void
}

const HeaderBackButton: React.FC<HeaderBackButtonProps> = ({ tintColor, icon = ArrowLeft, onPress, ...props }) => {
  const { navigateBack } = useRouting()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { colors } = theme

  return (
    <HoliButton
      label={t('navigation.headerLeft.back')}
      inline
      transparent
      onPress={() => (onPress ? onPress() : navigateBack())}
      testID="nav-button-back"
      {...props}
    >
      <HoliIcon icon={icon} color={tintColor || colors.foreground30} />
    </HoliButton>
  )
}

export default HeaderBackButton
