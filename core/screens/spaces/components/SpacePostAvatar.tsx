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

/*  Props we need
spacePost | needed for SpaceAvatar, userAvatar
*/

const SpacePostAvatar = ({ spacePost, loading = false, testID, style }: SpacePostAvatarProps) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  return (
    <View style={styles.avatarContainer}>
      <HoliAvatar
        style={[styles.spaceAvatar, style]}
        testID={testID ?? 'space-avatar'}
        imageSrc={spacePost?.space?.avatar}
        label={spacePost?.title ?? ''}
        loading={!!loading}
        initials={getInitials(spacePost?.title ?? '')}
      />
      <HoliAvatar
        style={[styles.userAvatar, style]}
        testID={testID ?? 'space-avatar'}
        imageSrc={spacePost?.creator?.avatar}
        label={spacePost?.title ?? ''}
        loading={!!loading}
        shape="circle"
        initials={getInitials(spacePost?.title ?? '')}
      />
    </View>
  )
}

export default React.memo(SpacePostAvatar)

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    avatarContainer: {
      position: 'relative',
      width: 40,
      height: 40,
    },
    spaceAvatar: {
      borderRadius: 6,
      alignItems: 'center',
      borderWidth: 0,
      justifyContent: 'center',
      overflow: 'hidden',
      /* maxWidth: 40,
      maxHeight: 40, */
      width: 40,
      height: 40,
    },
    userAvatar: {
      position: 'absolute',
      bottom: -5,
      right: -5,
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
