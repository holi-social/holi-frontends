import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, ViewStyle } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

type BackButtonProps = {
  icon?: string
  label?: string
  tintColor?: string
  style?: StyleProp<ViewStyle>
}

const BackButton: React.VFC<BackButtonProps> = ({
  label,
  icon = 'arrow-left-s',
  tintColor = colors.fontColorBlack,
  style,
}: BackButtonProps) => {
  const { navigateBack } = useRouting()
  const { t } = useTranslation()

  return (
    <HoliButton
      label={label || t('navigation.headerLeft.back')}
      inline
      transparent
      onPress={() => navigateBack()}
      style={[{ paddingHorizontal: 0 }, style]}
      testID="nav-button-back"
    >
      {/* negative margins because of bigger Icon (header buttons should not overlap header height) */}
      <HoliIcon icon={icon} size={30} color={tintColor} style={{ marginTop: -3, marginBottom: -3 }} />
    </HoliButton>
  )
}

export default BackButton
