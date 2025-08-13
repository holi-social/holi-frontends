import { useRef, useState } from 'react'
import { StyleSheet } from 'react-native-unistyles'
import type React from 'react'
import { Platform, View } from 'react-native'

import { BorderRadius, Spacing, IconSize } from 'holi-bricks/foundations'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Avatar, type AvatarProps } from 'holi-bricks/components/avatar'
import { CalendarIcon } from 'holi-bricks/components/calendarIcon'
import { Stack } from 'holi-bricks/components/stack'
import { Image, type MultiPlatformImageSource } from 'holi-bricks/components/image'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'
import { pickByHash } from 'holi-bricks/components/image/helpers'
import { placeholderImages } from 'holi-bricks/components/image/placeholderImages'

export interface CompactCardImageProps {
  imageSrc?: MultiPlatformImageSource
  date?: Date
  topIcon?: HoliIconType
  bottomIcon?: HoliIconType
  avatar?: Pick<AvatarProps, 'initials' | 'label' | 'source'>
  minHeight?: number
  imageLabel: string
  hashKey: string
}

export const CompactCardImage: React.FC<CompactCardImageProps> = ({
  imageSrc,
  date,
  topIcon,
  bottomIcon,
  avatar,
  minHeight,
  imageLabel,
  hashKey,
}: CompactCardImageProps) => {
  const [imageError, setImageError] = useState(false)
  const handleImageError = () => {
    setImageError(true)
  }

  const randomPlaceholderImage = useRef(pickByHash(placeholderImages, hashKey)).current

  return (
    <Stack alignItems="center" justifyContent="center">
      <Stack
        borderColor="default"
        borderRadius="xs"
        borderStyle="solid"
        borderWidth="sm"
        overflow="hidden"
        width={90}
        minHeight={minHeight}
        {...(Platform.OS === 'web' ? { height: '100%' } : {})}
      >
        <Image
          source={!imageError && imageSrc ? imageSrc : randomPlaceholderImage}
          width={90}
          height={130}
          alt={imageLabel}
          onError={handleImageError}
          resizeMode="cover"
          stretch
        />
      </Stack>

      {/* on top of the image */}
      {topIcon && (
        <View style={styles.topLeft}>
          <HoliIcon icon={topIcon} color="support" size={IconSize.sm} />
        </View>
      )}
      {bottomIcon && (
        <View style={styles.bottomRight}>
          <HoliIcon icon={bottomIcon} color="support" size={IconSize.sm} />
        </View>
      )}
      {date && (
        <View style={styles.bottomLeft}>
          <CalendarIcon day={date.getDate()} month={date.getMonth() + 1} size="md" colored={false} />
        </View>
      )}
      {avatar && (
        <View style={styles.bottomLeft}>
          <Avatar {...avatar} size="md" shape="square" border="light" />
        </View>
      )}
    </Stack>
  )
}

const styles = StyleSheet.create((theme) => ({
  topLeft: {
    position: 'absolute',
    top: 4,
    left: 4,
    borderRadius: BorderRadius.pill,
    padding: Spacing['4xs'],
    backgroundColor: theme.colors.bg.support,
  },
  bottomRight: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    borderRadius: BorderRadius.pill,
    padding: Spacing['4xs'],
    backgroundColor: theme.colors.bg.support,
  },
  bottomLeft: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    borderRadius: 6,
  },
}))
