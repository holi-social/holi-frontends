import React from 'react'
import { useTranslation } from 'react-i18next'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import Holicon from '@holi/ui/components/holicon'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

type BackButtonProps = {
  icon?: string
  label?: string
}

const BackButton: React.VFC<BackButtonProps> = (props: BackButtonProps) => {
  const { navigateBack } = useRouting()
  const { t } = useTranslation()

  return (
    <HoliButton
      label={props.label || t('navigation.headerLeft.back')}
      inline
      transparent
      onPress={() => navigateBack()}
      style={{ paddingHorizontal: 0 }}
      testID="nav-button-back"
    >
      <Holicon icon={props.icon || 'arrow-back'} size={30} color={colors.softblack} />
    </HoliButton>
  )
}

export default BackButton
