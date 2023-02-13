import React from 'react'
import { useTranslation } from 'react-i18next'
import { Linking } from 'react-native'

import { HeaderButtonProps } from '@react-navigation/native-stack/lib/typescript/src/types'

import { useAuth } from '@holi/core/auth/AuthContextProvider'
import { useToastForNotAvailableFeature } from '@holi/core/helpers'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'

const NotificationSearchButtons = ({ tintColor }: HeaderButtonProps) => {
  const { t } = useTranslation()
  const { navigate } = useUnifiedNavigation()
  const { isLoggedIn } = useAuth()

  // TODO: remove after implementing the feature
  const showFeatureNotImplementedToast = useToastForNotAvailableFeature()

  return (
    <HoliHorizontalRow>
      {/* TODO start: remove after Alpha */}
      <HoliButton
        type="secondary"
        variant="small"
        label=""
        onPress={() => Linking.openURL('https://fjyj0x83dwu.typeform.com/to/Q0W2YncW')}
      >
        Feedback
      </HoliButton>
      {/* TODO end: remove after Alpha */}

      {isLoggedIn ? (
        <HoliButton
          label={t('notifications.title')}
          inline
          transparent
          onPress={() => {
            navigate('/notifications')
          }}
        >
          <HoliIcon icon="notification-2" size={24} color={tintColor} />
        </HoliButton>
      ) : (
        [] // The && form rendered a div with margins leading to undesired spacing
      )}

      <HoliButton
        label={t('navigation.search')}
        inline
        transparent
        onPress={() => {
          // TODO: remove after implementing the feature
          showFeatureNotImplementedToast()
          // navigate('/search')
        }}
      >
        <HoliIcon icon="search" size={24} color={tintColor} />
      </HoliButton>
    </HoliHorizontalRow>
  )
}

export default NotificationSearchButtons
