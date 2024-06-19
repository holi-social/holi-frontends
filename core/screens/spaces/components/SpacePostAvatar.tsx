import React, { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { getInitials } from '@holi/core/helpers'
import { Post } from '@holi/core/screens/posts/types'
import HoliAvatar, { type AvatarProps } from '@holi/ui/components/molecules/HoliAvatar'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export interface SpacePostAvatarProps {
  spacePost: Post
  size?: AvatarProps['size']
  style?: AvatarProps['style']
  loading?: boolean
  testID?: string
}

const SpacePostAvatar = ({ spacePost, loading = false, testID, style }: SpacePostAvatarProps) => {
  const { theme } = useTheme()
  const spaceInitials = getInitials(spacePost?.space?.title ?? '')
  const creatorInitials = spacePost?.creator?.avatarLabel
  const styles = useMemo(() => getStyles(theme), [theme])

  return (
    <View style={styles.avatarContainer}>
      <HoliAvatar
        style={[styles.spaceAvatar, style]}
        testID={testID ?? 'space-avatar'}
        imageSrc={spacePost?.space?.avatar}
        imageBlurhash={spacePost?.space?.avatarBlurhash}
        defaultColor={spacePost?.space?.avatarDefaultColor}
        label={spacePost?.title ?? ''}
        loading={!!loading}
        fontSize={14}
        initials={spaceInitials}
      />
      <HoliAvatar
        style={[styles.userAvatar, style]}
        testID={testID ?? 'space-avatar'}
        imageSrc={spacePost?.creator?.avatar}
        label={spacePost?.title ?? ''}
        loading={!!loading}
        shape="circle"
        fontSize={8}
        initials={creatorInitials}
      />
    </View>
  )
}

export default React.memo(SpacePostAvatar)

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    avatarContainer: {
      position: 'relative',
      width: 35,
      height: 35,
    },
    spaceAvatar: {
      borderRadius: 6,
      alignItems: 'center',
      borderWidth: 0,
      justifyContent: 'center',
      overflow: 'hidden',
      width: 35,
      height: 35,
    },
    userAvatar: {
      fontSize: 5,
      position: 'absolute',
      top: 16,
      left: 16,
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: theme.colors.white100,
      justifyContent: 'center',
      overflow: 'hidden',
      /*       maxWidth: 24,
      maxHeight: 24, */
      width: 24,
      height: 24,
    },
  })
