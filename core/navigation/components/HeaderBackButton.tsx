import type React from 'react'
import { useTranslation } from 'react-i18next'
import type { StyleProp, ViewStyle } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'
import { ArrowLeft } from '@holi/icons/src/generated'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { Spacing } from 'holi-bricks/tokens'
import { HoliIcon } from '@holi/icons/src/HoliIcon'

export interface HeaderBackButtonProps {
  label?: string
  tintColor?: string
  icon?: HoliIconType
  style?: StyleProp<ViewStyle>
  testID?: string
  onPress?: () => void
  fallbackRoute?: string
}

const HeaderBackButton: React.FC<HeaderBackButtonProps> = ({
  label,
  icon = ArrowLeft,
  tintColor,
  onPress,
  testID = 'nav-button-back',
  fallbackRoute,
  ...props
}) => {
  const { navigateBack } = useRouting()
  const { t } = useTranslation()

  return (
    <HoliButton
      label={label ?? t('navigation.headerLeft.back')}
      inline
      transparent
      onPress={onPress ?? (() => navigateBack(fallbackRoute))}
      testID={testID}
      {...props}
    >
      <HoliIcon icon={icon} size={Spacing.md} color={tintColor} />
    </HoliButton>
  )
}

export default HeaderBackButton
