import React from 'react'
import { ViewStyle } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliButton from '@holi/ui/components/HoliButton'
import HoliIcon from '@holi/ui/components/HoliIcon'

export type HeaderTitleProps = {
  style?: ViewStyle | Record<string, unknown>
  testID?: string
}

const HeaderProfileLink: React.VoidFunctionComponent<HeaderTitleProps> = (props: HeaderTitleProps) => {
  const { navigate } = useRouting()

  return (
    <HoliButton
      label="Notifications"
      inline
      transparent
      onPress={() => navigate('/notifications')}
      {...props}
      style={[props.style]}
    >
      <HoliIcon icon="bell" size={20} />
    </HoliButton>
  )
}

export default HeaderProfileLink
