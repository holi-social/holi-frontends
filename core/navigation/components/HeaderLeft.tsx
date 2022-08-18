import React from 'react'
import { useTranslation } from 'react-i18next'
import { ViewStyle } from 'react-native'

import { useNavigationContext } from '@holi/core/navigation/NavigationContextProvider'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

export type HeaderTitleProps = {
  style?: ViewStyle | Record<string, unknown>
  testID?: string
}

const HeaderLeft: React.VoidFunctionComponent<HeaderTitleProps> = (props: HeaderTitleProps) => {
  const { navigate } = useRouting()
  const navigationContext = useNavigationContext()
  const { t } = useTranslation()

  if (navigationContext.headerLeft) return navigationContext.headerLeft

  return (
    <HoliButton
      label={t('notifications.title')}
      inline
      transparent
      onPress={() => navigate('/notifications')}
      {...props}
      style={props.style || {}}
    >
      <HoliIcon icon="notification-2" size={20} />
    </HoliButton>
  )
}

export default HeaderLeft
