import React from 'react'
import { useTranslation } from 'react-i18next'

import { HeaderButtonProps } from '@react-navigation/native-stack/lib/typescript/src/types'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

export interface CreateSpaceButtonProps extends HeaderButtonProps {
  onPress: () => void
}

const CreateSpaceButton = ({ tintColor, onPress }: CreateSpaceButtonProps) => {
  const { t } = useTranslation()

  return (
    <HoliButton label={t('spaces.create.space.title')} inline transparent onPress={() => onPress()}>
      <HoliIcon icon="add-box" size={24} color={tintColor} />
    </HoliButton>
  )
}

export default CreateSpaceButton
