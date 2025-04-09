import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Avatar, type AvatarProps } from 'holi-bricks/components/avatar'
import CalendarIcon from 'holi-bricks/components/CalendarIcon/CalendarIcon'
import { Stack } from 'holi-bricks/components/stack'
import { Platform, View } from 'react-native'
import { Image, type ImageSource } from 'holi-bricks/components/image'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'
import { useRef } from 'react'
import { useStyles } from 'holi-bricks/hooks'
import { useTranslation } from 'react-i18next'
import { createStyleSheet } from 'holi-bricks/utils'
import { BorderRadius, Spacing } from 'holi-bricks/tokens'
import type React from 'react'

export interface CompactCardImageProps {
  imageSrc?: ImageSource
  date?: Date
  topIcon?: HoliIconType
  bottomIcon?: HoliIconType
  avatar?: Pick<AvatarProps, 'initials' | 'label' | 'source'>
  minHeight?: number
}

export const CompactCardImage: React.FC<CompactCardImageProps> = ({
  imageSrc,
  date,
  topIcon,
  bottomIcon,
  avatar,
  minHeight,
}: CompactCardImageProps) => {
  const { styles } = useStyles(stylesheet)
  const { t } = useTranslation()

  const placeholderImages = [
    require('@holi/ui/assets/img/events/thumbnail-green.svg'),
    require('@holi/ui/assets/img/events/thumbnail-blue.svg'),
    require('@holi/ui/assets/img/events/thumbnail-purple.svg'),
    require('@holi/ui/assets/img/events/thumbnail-yellow.svg'),
    require('@holi/ui/assets/img/events/thumbnail-green-full.svg'),
    require('@holi/ui/assets/img/events/thumbnail-blue-full.svg'),
    require('@holi/ui/assets/img/events/thumbnail-purple-full.svg'),
    require('@holi/ui/assets/img/events/thumbnail-yellow-full.svg'),
  ]
  const randomPlaceholderImage = useRef(placeholderImages[Math.floor(Math.random() * placeholderImages.length)]).current

  return (
    <Stack alignItems="center" justifyContent="center">
      <Stack
        borderColor="default"
        borderRadius="xs"
        borderStyle="solid"
        borderWidth={1}
        overflow="hidden"
        width={90}
        minHeight={minHeight}
        {...(Platform.OS === 'web' ? { height: '100%' } : {})}
      >
        <Image
          source={imageSrc ? imageSrc : randomPlaceholderImage}
          width={90}
          height={Platform.OS === 'web' ? '100%' : 130}
          alt={t('act.events.thumbnail.label')}
          resizeMode="cover"
          stretch
        />
      </Stack>

      {/* on top of the image */}
      {topIcon && (
        <View style={styles.topLeft}>
          <HoliIcon icon={topIcon} color="support" size={16} />
        </View>
      )}
      {bottomIcon && (
        <View style={styles.bottomRight}>
          <HoliIcon icon={bottomIcon} color="support" size={16} />
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

const stylesheet = createStyleSheet((theme) => ({
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
