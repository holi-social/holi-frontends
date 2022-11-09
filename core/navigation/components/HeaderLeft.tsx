import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, ViewStyle } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

export type HeaderTitleProps = {
  label?: string
  tintColor?: string
  style?: StyleProp<ViewStyle>
  testID?: string
}

const HeaderLeft: React.VFC<HeaderTitleProps> = (props: HeaderTitleProps) => {
  const { navigate } = useRouting()
  const { t } = useTranslation()

  return (
    <HoliButton
      label={t('notifications.title')}
      inline
      transparent
      onPress={() => navigate('/notifications')}
      {...props}
      style={props.style || {}}
    >
      <HoliIcon icon="notification-2" size={24} />
    </HoliButton>
  )
}

export default HeaderLeft
