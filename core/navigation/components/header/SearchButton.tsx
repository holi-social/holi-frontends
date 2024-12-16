import type React from 'react'
import { useTranslation } from 'react-i18next'

import { Search } from '@holi/icons/src/generated'
import { ButtonIcon } from 'holi-bricks/components/button'

export const SearchButton: React.FC<{ onPress: () => void; color: string | undefined }> = (props) => {
  const { t } = useTranslation()

  return <ButtonIcon label={t('navigation.search')} icon={Search} transparent onPress={props.onPress} size="lg" />
}
