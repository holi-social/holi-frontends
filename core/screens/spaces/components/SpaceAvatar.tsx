import * as React from 'react'
import { StyleSheet } from 'react-native'

import { getInitials, stringToColor } from '@holi/core/helpers'
import { Space } from '@holi/core/screens/spaces/types'
import HoliAvatar, { AvatarProps } from '@holi/ui/components/molecules/HoliAvatar'
import { colors } from '@holi/ui/styles/globalVars'

export interface SpaceAvatarProps {
  space: Space
  size?: AvatarProps['size']
  style?: AvatarProps['style']
  testID?: string
}

const SpaceAvatar = ({ space, size = 'extralarge', testID, style }: SpaceAvatarProps) => {
  const initials = getInitials(space.title)
  const color = stringToColor(initials)

  return (
    <HoliAvatar
      style={[styles.spaceAvatar, style]}
      testID={testID || 'space-avatar'}
      imageSrc={space.avatar}
      label={space.title}
      defaultColor={color}
      initials={initials}
      size={size}
    />
  )
}

export default React.memo(SpaceAvatar)

const styles = StyleSheet.create({
  spaceAvatar: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.foreground30,
    maxWidth: 128,
    maxHeight: 128,
  },
})
