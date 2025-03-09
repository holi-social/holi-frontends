import React, { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { getInitials } from '@holi/core/helpers'
import type { Post } from '@holi/core/screens/posts/types'
import { Avatar } from 'holi-bricks/components/avatar'

export interface SpacePostAvatarProps {
  spacePost: Post
  loading?: boolean
  testID?: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SpacePostAvatar = ({ spacePost, loading = false, testID }: SpacePostAvatarProps) => {
  const spaceInitials = getInitials(spacePost?.space?.title ?? '')
  const creatorInitials = spacePost?.creator?.avatarLabel
  const styles = useMemo(() => getStyles(), [])

  return (
    <View style={styles.avatarContainer}>
      <Avatar
        imgPlaceholder={spacePost?.space?.avatarBlurhash}
        testID={testID ?? 'space-avatar'}
        source={spacePost?.space?.avatar}
        label={spacePost?.title ?? ''}
        initials={spaceInitials}
        size="sm"
      />
      <View style={styles.userAvatar}>
        <Avatar
          testID={testID ?? 'space-avatar'}
          source={spacePost?.creator?.avatar}
          label={spacePost?.title ?? ''}
          shape="circle"
          initials={creatorInitials}
          size="xs"
        />
      </View>
    </View>
  )
}

export default React.memo(SpacePostAvatar)

const getStyles = () =>
  StyleSheet.create({
    avatarContainer: {
      position: 'relative',
      width: 35,
      height: 35,
    },
    userAvatar: {
      position: 'absolute',
      top: 16,
      left: 16,
      alignItems: 'center',
      borderWidth: 0,
      justifyContent: 'center',
      overflow: 'hidden',
    },
  })
