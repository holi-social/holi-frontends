import React from 'react'
import { useTranslation } from 'react-i18next'

import { useHasNewNotifications } from '@holi/core/helpers/useHasNewNotifications'
import { SearchButton } from '@holi/core/navigation/components/header/SearchButton'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { Notification2 } from '@holi/icons/src/generated'
import { HoliButtonBell } from '@holi/ui/components/molecules/HoliButtonBell'
import { Stack } from 'holi-bricks/components/stack'

const NotificationAndSearchHeader = () => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const hasNewNotifications = useHasNewNotifications()

  return (
    <Stack direction="row" gap="md">
      <HoliButtonBell
        label={t('notifications.title')}
        icon={Notification2}
        showBell={hasNewNotifications}
        onPress={() => {
          navigate('/notifications')
        }}
        testID="btn-to-notifications"
      />

      <SearchButton />
    </Stack>
  )
}

export default NotificationAndSearchHeader
