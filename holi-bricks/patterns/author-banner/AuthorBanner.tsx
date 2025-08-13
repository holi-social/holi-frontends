import React from 'react'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { Stack } from 'holi-bricks/components/stack'
import { Avatar, type AvatarProps } from 'holi-bricks/components/avatar'
import { Text } from 'holi-bricks/components/text'
import { Spacing } from 'holi-bricks/foundations'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ExternalLink } from '@holi/icons/src/generated'

type _AvatarProps = Omit<AvatarProps, 'size' | 'shape' | 'border' | 'testID'>
export type AuthorBannerProps = {
  onPress?(): void
  topTitle?: string
  isExternalLink?: boolean
  title: string
  subtitle?: string
  mainAvatar: _AvatarProps
  secondaryAvatar?: _AvatarProps
}

export const AuthorBanner = ({
  mainAvatar,
  secondaryAvatar = undefined,
  topTitle,
  title,
  subtitle,
  isExternalLink = false,
  onPress,
}: AuthorBannerProps) => {
  return (
    <Stack width="100%" onPress={onPress} direction="row" gap="3xs" alignItems="flex-start">
      <View style={styles.avatarWrapper}>
        <Avatar {...mainAvatar} size="md" border="strong" shape="square" />
        {secondaryAvatar?.source && (
          <View style={styles.miniAvatar}>
            <Avatar {...secondaryAvatar} size="xs" shape="circle" border="light" />
          </View>
        )}
      </View>
      <Stack flex={1} direction="row" alignItems="center" gap="sm" justifyContent="space-between">
        <Stack direction="column" gap="4xs">
          {topTitle && (
            <Text size="xs" color="support">
              {topTitle}
            </Text>
          )}
          <Text size="md">{title}</Text>
          {subtitle && <Text size="sm">{subtitle}</Text>}
        </Stack>
        {isExternalLink && <HoliIcon icon={ExternalLink} size={20} />}
      </Stack>
    </Stack>
  )
}

const styles = StyleSheet.create(() => ({
  avatarWrapper: {
    position: 'relative',
  },
  miniAvatar: {
    position: 'absolute',
    right: -Spacing['4xs'],
    bottom: -Spacing['4xs'],
  },
}))
