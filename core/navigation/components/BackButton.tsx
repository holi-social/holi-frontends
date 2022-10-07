import React from 'react'
import { useTranslation } from 'react-i18next'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

type BackButtonProps = {
  icon?: string
  label?: string
  tintColor?: string
}

const BackButton: React.VFC<BackButtonProps> = ({
  label,
  icon = 'arrow-left-s',
  tintColor = colors.fontColorBlack,
}: BackButtonProps) => {
  const { navigateBack } = useRouting()
  const { t } = useTranslation()

  return (
    <HoliButton
      label={label || t('navigation.headerLeft.back')}
      inline
      transparent
      onPress={() => navigateBack()}
      style={{ paddingHorizontal: 0 }}
      testID="nav-button-back"
    >
      <HoliIcon icon={icon} size={30} color={tintColor} />
    </HoliButton>
  )
}

export default BackButton
