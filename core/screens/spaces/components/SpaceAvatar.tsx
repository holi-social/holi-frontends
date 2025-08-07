import React from 'react'
import { useClientWindowDimensions } from '@holi/core/helpers/useClientWindowDimensions'
import type { Space } from '@holi/api/graphql/graphql-codegen'
import { Avatar, type AvatarSizes } from 'holi-bricks/components/avatar'
import { breakpoints } from 'holi-bricks/foundations'

export interface SpaceAvatarProps {
  space?: Pick<Space, 'avatar' | 'avatarBlurhash' | 'avatarDefaultColor' | 'title'>
  size?: AvatarSizes
  loading?: boolean
  testID?: string
}

const SpaceAvatar = ({ space, size, testID }: SpaceAvatarProps) => {
  const { width: deviceWidth } = useClientWindowDimensions()

  const defaultSize = deviceWidth > breakpoints.xl ? 'xl' : 'lg'
  return (
    <Avatar
      testID={testID ?? 'space-avatar'}
      source={space?.avatar}
      imgPlaceholder={space?.avatarBlurhash}
      label={space?.title ?? ''}
      initials={space?.title ?? ''}
      size={size ?? defaultSize}
      shape="square"
      border="strong"
    />
  )
}

export default React.memo(SpaceAvatar)
