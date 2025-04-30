import type React from 'react'
import { View } from 'react-native'

import { Avatar, type AvatarProps } from 'holi-bricks/components/avatar'
import { AvatarSizesValues } from 'holi-bricks/components/avatar/Avatar'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'

type Avatars = Pick<AvatarProps, 'initials' | 'label' | 'source' | 'imgPlaceholder'>
interface AvatarPileProps extends Omit<AvatarProps, 'initials' | 'label' | 'imgSrc' | 'imgPlaceholder'> {
  avatars: Avatars[]
}

const AvatarPile = ({
  avatars,
  size = 'md',
  testID = 'holi-user-avatar-pile',
  border,
  shape,
  icon,
}: AvatarPileProps) => {
  const { styles } = useStyles(stylesheet)
  const overlapDistance = AvatarSizesValues[size] / -2.4

  return (
    <View style={styles.container} testID={testID}>
      {avatars?.map((avatar, idx) => {
        return (
          <View style={styles.overlap(idx, overlapDistance)} key={avatar.source || `avatar-${avatar.initials}-${idx}`}>
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

const stylesheet = createStyleSheet(() => ({
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
