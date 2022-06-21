import React from 'react'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliButton from '@holi/ui/components/HoliButton'
import HoliIcon from '@holi/ui/components/HoliIcon'

// export type AvatarProps = {
//   style?: (ViewStyle | Record<string, unknown> | undefined) | (ViewStyle | Record<string, unknown> | undefined)[]
//   imageSrc: string | undefined
//   nameLabel: string
//   defaultColor: string
//   size?: 'micro' | 'small' | 'medium' | 'large' | 'extralarge'
//   testID?: string
// }

const HeaderProfileLink: React.VoidFunctionComponent = (props) => {
  const { navigate, pathname } = useRouting()

  const isNotifications = pathname.startsWith('/notifications')

  return (
    <HoliButton
      label="Notifications"
      inline
      transparent
      onPress={() => navigate('/notifications')}
      style={[{ paddingHorizontal: 0 }, props.style]}
      {...props}
    >
      <HoliIcon icon="bell" size={20} filled={isNotifications} />
    </HoliButton>
  )
}

export default HeaderProfileLink
