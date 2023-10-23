import React from 'react'
import { useTranslation } from 'react-i18next'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Search } from '@holi/icons/src/generated'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

export const SearchButton: React.FC<{ onPress: () => void; color: string | undefined }> = (props) => {
  const { t } = useTranslation()

  return (
    <HoliButton label={t('navigation.search')} inline transparent onPress={props.onPress}>
      <HoliIcon icon={Search} color={props.color} />
    </HoliButton>
  )
}
