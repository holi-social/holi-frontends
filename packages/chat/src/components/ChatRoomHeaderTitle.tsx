import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import { Avatar } from 'holi-bricks/components/avatar'
import type { AvatarShape } from 'holi-bricks/components/avatar/Avatar'
import { Text } from 'holi-bricks/components/text'

interface Props {
  href?: string
  name: string
  imageSrc?: string
  imageBlurhash?: string
  initials?: string
  defaultColor?: string
  shape?: AvatarShape
}

const ChatRoomHeaderTitle = ({ href, name, initials, ...avatarProps }: Props) => {
  const { t } = useTranslation()

  const content = (
    <View style={styles.title}>
      {initials && <Avatar label={name} initials={initials} {...avatarProps} size="xs" />}
      <Text size="lg">{name}</Text>
    </View>
  )

  return (
    <View style={styles.container}>
      {href ? (
        <HoliLink label={t('user.visitProfile', { name })} href={href}>
          {content}
        </HoliLink>
      ) : (
        content
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    columnGap: 20,
  },
  title: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
})

export default ChatRoomHeaderTitle
