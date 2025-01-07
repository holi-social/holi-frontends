import React from 'react'
import { useTranslation } from 'react-i18next'

import { HeaderButtonProps } from '@react-navigation/native-stack/lib/typescript/src/types'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { AddBox } from '@holi/icons/src/generated'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

export interface CreateSpaceButtonProps extends HeaderButtonProps {
  onPress: () => void
}

const CreateSpaceButton = ({ tintColor, onPress }: CreateSpaceButtonProps) => {
  const { t } = useTranslation()

  return (
    <HoliButton label={t('spaces.create.title')} inline transparent onPress={onPress} testID="btn-create-space">
      <HoliIcon icon={AddBox} color={tintColor} />
    </HoliButton>
  )
}

export default CreateSpaceButton
