import type React from 'react'
import { View } from 'react-native'

import { Avatar, type AvatarProps } from 'holi-bricks/components/avatar'
import { AvatarSizesValues } from 'holi-bricks/components/avatar/Avatar'
import { useStyles } from 'holi-bricks/hooks'
import { createStyleSheet } from 'holi-bricks/utils'
// eslint-disable-next-line no-restricted-imports
import type { User } from '@holi/core/domain/shared/types'

interface AvatarPileProps extends Omit<AvatarProps, 'initials' | 'label' | 'imgSrc' | 'initials' | 'imgPlaceholder'> {
  users: User[]
}

const AvatarPile = ({
  users,
  size = 'md',
  testID = 'holi-user-avatar-pile',
  border,
  shape,
  icon,
}: React.PropsWithChildren<AvatarPileProps>) => {
  const { styles } = useStyles(stylesheet)
  return (
    <View style={styles.container} testID={testID}>
      {users?.map((user, idx) => {
        const overlapDistance = AvatarSizesValues[size] / -2.4
        return (
          <View style={styles.overlap(idx, overlapDistance)} key={idx}>
            <Avatar
              border={border}
              shape={shape}
              size={size}
              label={user.fullName}
              source={user.avatar}
              initials={user.avatarLabel}
              testID={'pile-avatar'}
              imgPlaceholder={user.avatarBlurhash}
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
