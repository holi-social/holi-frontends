import * as React from 'react'
import { StyleSheet } from 'react-native'

import { getInitials } from '@holi/core/helpers'
import { useClientWindowDimensions } from '@holi/core/helpers/useClientWindowDimensions'
import { Space } from '@holi/core/screens/spaces/types'
import HoliAvatar, { AvatarProps } from '@holi/ui/components/molecules/HoliAvatar'
import { colors, dimensions } from '@holi/ui/styles/globalVars'

export interface SpaceAvatarProps {
  space?: Pick<Space, 'avatar' | 'avatarBlurhash' | 'avatarDefaultColor' | 'title'>
  size?: AvatarProps['size']
  style?: AvatarProps['style']
  loading?: boolean
  testID?: string
}

const SpaceAvatar = ({ space, size, loading = false, testID, style }: SpaceAvatarProps) => {
  const initials = getInitials(space?.title ?? '')
  const { width: deviceWidth } = useClientWindowDimensions()

  const defaultSize = deviceWidth > dimensions.breakpointXl ? 'extralarge' : 'large'

  return (
    <HoliAvatar
      style={[styles.spaceAvatar, style]}
      testID={testID || 'space-avatar'}
      imageSrc={space?.avatar}
      imageBlurhash={space?.avatarBlurhash}
      label={space?.title}
      defaultColor={space?.avatarDefaultColor}
      initials={initials}
      size={size || defaultSize}
      loading={!!loading}
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
