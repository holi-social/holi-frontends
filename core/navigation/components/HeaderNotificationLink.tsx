import React from 'react'
import { ViewStyle } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliButton from '@holi/ui/components/HoliButton'
import HoliIcon from '@holi/ui/components/HoliIcon'

export type HeaderTitleProps = {
  style?: ViewStyle | Record<string, unknown>
  testID?: string
}

const HeaderNotificationLink: React.VoidFunctionComponent<HeaderTitleProps> = (props: HeaderTitleProps) => {
  const { navigate } = useRouting()

  return (
    <HoliButton
      label="Notifications"
      inline
      variant="transparent"
      onPress={() => navigate('/notifications')}
      {...props}
      style={[{ paddingHorizontal: 0 }, props.style || {}]}
    >
      <HoliIcon icon="bell" size={20} />
    </HoliButton>
  )
}

export default HeaderNotificationLink
