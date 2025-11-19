import React from 'react'
import { useTranslation } from 'react-i18next'

import { AddBox } from '@holi/icons/src/generated'
import { ButtonIcon } from 'holi-bricks/components/button'

export interface CreateSpaceButtonProps {
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
