import React from 'react'
import { useTranslation } from 'react-i18next'

import { HeaderButtonProps } from '@react-navigation/native-stack/lib/typescript/src/types'

import { useToastForNotAvailableFeature } from '@holi/core/helpers'
import { FeatureToggleName, useFeatureToggle } from '@holi/core/helpers/useFeatureToggle'
import { useHasNewNotifications } from '@holi/core/helpers/useHasNewNotifications'
import { SearchButton } from '@holi/core/navigation/components/header/SearchButton'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { Notification2 } from '@holi/icons/src/generated'
import { HoliButtonBell } from '@holi/ui/components/molecules/HoliButtonBell'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'
import { useTheme } from '@holi/ui/styles/theme'

const NotificationAndSearchHeader = ({ tintColor }: HeaderButtonProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const showFeatureNotImplementedToast = useToastForNotAvailableFeature()
  const hasNewNotifications = useHasNewNotifications()
  const {
    theme: { colors },
  } = useTheme()

  const { ftOff } = useFeatureToggle(FeatureToggleName.SEARCH)

  return (
    <HoliHorizontalRow>
      <HoliButtonBell
        label={t('notifications.title')}
        icon={Notification2}
        showBell={hasNewNotifications}
        onPress={() => {
          navigate('/notifications')
        }}
        color={tintColor || colors.foreground30}
        testID="btn-to-notifications"
      />

      <SearchButton
        onPress={!ftOff ? () => navigate('/search') : showFeatureNotImplementedToast}
        color={tintColor || colors.foreground30}
      />
    </HoliHorizontalRow>
  )
}

export default NotificationAndSearchHeader
