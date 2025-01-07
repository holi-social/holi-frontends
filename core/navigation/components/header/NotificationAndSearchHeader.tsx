import React from 'react'
import { useTranslation } from 'react-i18next'

import { HeaderButtonProps } from '@react-navigation/native-stack/lib/typescript/src/types'

import { useHasNewNotifications } from '@holi/core/helpers/useHasNewNotifications'
import { SearchButton } from '@holi/core/navigation/components/header/SearchButton'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { Notification2 } from '@holi/icons/src/generated'
import { HoliButtonBell } from '@holi/ui/components/molecules/HoliButtonBell'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'

const NotificationAndSearchHeader = ({ tintColor }: HeaderButtonProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const hasNewNotifications = useHasNewNotifications()

  return (
    <HoliHorizontalRow>
      <HoliButtonBell
        label={t('notifications.title')}
        icon={Notification2}
        showBell={hasNewNotifications}
        onPress={() => {
          navigate('/notifications')
        }}
        color={tintColor}
        testID="btn-to-notifications"
      />

      <SearchButton onPress={() => navigate('/search')} color={tintColor} />
    </HoliHorizontalRow>
  )
}

export default NotificationAndSearchHeader
