import React from 'react'
import { useTranslation } from 'react-i18next'

import { HeaderButtonProps } from '@react-navigation/native-stack/lib/typescript/src/types'

import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

const CreateSpaceButton = ({ tintColor }: HeaderButtonProps) => {
  const { t } = useTranslation()
  const { navigate } = useUnifiedNavigation()

  return (
    <HoliButton
      label={t('spaces.create.space.title')}
      inline
      transparent
      onPress={() => {
        navigate('/spaces/createSpace')
      }}
    >
      <HoliIcon icon="add-box" size={24} color={tintColor} />
    </HoliButton>
  )
}

export default CreateSpaceButton
