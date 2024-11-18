import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { Avatar } from 'holi-bricks/components/avatar'
import type { AvatarShape } from 'holi-bricks/components/avatar/Avatar'

interface Props {
  href?: string
  name: string
  imageSrc?: string
  imageBlurhash?: string
  initials: string
  defaultColor?: string
  shape?: AvatarShape
}

const ChatRoomHeaderTitle = ({ href, name, ...avatarProps }: Props) => {
  const { t } = useTranslation()

  const content = (
    <View style={styles.title}>
      <Avatar label={name} {...avatarProps} size="xs" />
      <HoliText bold>{name}</HoliText>
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
