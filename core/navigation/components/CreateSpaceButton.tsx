import React from 'react'
import { useTranslation } from 'react-i18next'

import type { HeaderButtonProps } from '@react-navigation/native-stack/lib/typescript/src/types'

import { AddBox } from '@holi/icons/src/generated'
import { ButtonIcon } from 'holi-bricks/components/button'

export interface CreateSpaceButtonProps extends HeaderButtonProps {
  onPress: () => void
}

const CreateSpaceButton = ({ onPress }: CreateSpaceButtonProps) => {
  const { t } = useTranslation()

  return (
    <ButtonIcon
      label={t('spaces.create.title')}
      transparent
      onPress={onPress}
      testID="btn-create-space"
      icon={AddBox}
      size="lg"
    />
  )
}

export default CreateSpaceButton
