import React from 'react'

import { HeaderButtonProps } from '@react-navigation/native-stack/lib/typescript/src/types'

import { useToastForNotAvailableFeature } from '@holi/core/helpers'
import { NotificationBellButton } from '@holi/core/navigation/components/header/NotificationBellButton'
import { SearchButton } from '@holi/core/navigation/components/header/SearchButton'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'

const NotificationAndSearchHeader = ({ tintColor }: HeaderButtonProps) => {
  const { navigate } = useRouting()
  const showFeatureNotImplementedToast = useToastForNotAvailableFeature()

  return (
    <HoliHorizontalRow>
      <NotificationBellButton
        onPress={() => {
          navigate('/notifications')
        }}
        color={tintColor}
      />

      <SearchButton
        // navigate('/search')
        onPress={showFeatureNotImplementedToast}
        color={tintColor}
      />
    </HoliHorizontalRow>
  )
}

export default NotificationAndSearchHeader
