import type React from 'react'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { Avatar, type AvatarProps } from 'holi-bricks/components/avatar'
import { AvatarSizesValues } from 'holi-bricks/components/avatar/Avatar'
import { layoutStyle } from 'holi-bricks/foundations'
import { accessibilityProps } from 'holi-bricks/foundations/accessibility'

type Avatars = Pick<AvatarProps, 'initials' | 'label' | 'source' | 'imgPlaceholder'>
export interface AvatarPileProps extends Omit<AvatarProps, 'initials' | 'label' | 'imgSrc' | 'imgPlaceholder'> {
  avatars: Avatars[]
}

const AvatarPile = ({
  avatars,
  size = 'md',
  testID = 'holi-user-avatar-pile',
  border,
  shape,
  icon,
  ...rest
}: AvatarPileProps) => {
  const overlapDistance = AvatarSizesValues[size] / -2.4

  return (
    <View style={[styles.container, layoutStyle(rest)]} testID={testID} {...accessibilityProps(rest)}>
      {avatars?.map((avatar, idx) => {
        return (
          <View style={styles.overlap(idx, overlapDistance)} key={avatar.label || `avatar-${avatar.initials}-${idx}`}>
            <Avatar
              border={border}
              shape={shape}
              size={size}
              label={avatar.label}
              source={avatar.source}
              initials={avatar.initials}
              testID={'pile-avatar'}
              imgPlaceholder={avatar.imgPlaceholder}
              icon={icon}
            />
          </View>
        )
      })}
    </View>
  )
}

export default AvatarPile

const styles = StyleSheet.create(() => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overlap: (idx, overlapDistance) => {
    return {
      marginLeft: idx ? overlapDistance : 0,
      zIndex: idx * -1,
    }
  },
}))
