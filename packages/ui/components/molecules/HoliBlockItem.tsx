import type { PropsWithChildren } from 'react'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import { useFallbackImage } from '@holi/core/helpers'
import type { User } from '@holi/core/screens/userprofile/types'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliLink from '@holi/ui/components/atoms/HoliLink'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import { colors } from '@holi/ui/styles/globalVars'

interface BaseProps {
  title: string
  subtitle?: string
  description?: string
  users: User[]
  imageSrc?: string
  imageBlurhash?: string
  imageElement?: React.ReactNode
  href: string
  label: string
  size?: 'small' | 'large'
  testID?: string
  totalUserCount?: number
  cardWidthForImageScaling?: number
}

interface SkeletonProps extends Partial<BaseProps> {
  loading: true
}

interface Props extends BaseProps {
  loading?: false
}

type HoliBlockItemProps = SkeletonProps | Props

const SMALL_IMAGE_DIMENSION = 64
const SMALL_OUTER_BORDER_RADIUS = 8

// very hard to calculate, estimated for simplicity
// hint: we could make the skeleton calculate this by giving it transparent
// children that behave similar like the actual component children
// (aspect ratio image + multiple lines of text)
const LARGE_SKELETON_HEIGHT = Platform.OS == 'web' ? 300 : 220
const LARGE_OUTER_BORDER_RADIUS = 16
const LARGE_IMAGE_ASPECT_RATIO = 240 / 160

const HoliBlockItem = ({
  loading,
  title,
  subtitle,
  description,
  users,
  imageSrc,
  imageBlurhash,
  imageElement,
  href,
  label,
  testID = 'holi-block-item',
  size = 'small',
  totalUserCount,
  cardWidthForImageScaling,
}: PropsWithChildren<HoliBlockItemProps>) => {
  const { t } = useTranslation()
  const isSmall = size === 'small'
  const styles = isSmall ? stylesSmall : stylesLarge
  const fallbackImageUri = useFallbackImage().uri
  const largeImageWidth = cardWidthForImageScaling ? cardWidthForImageScaling - 2 * styles.container.padding : undefined
  const imageSource = isSmall
    ? {
        uri: imageSrc ? imageSrc : fallbackImageUri,
        width: SMALL_IMAGE_DIMENSION,
        height: SMALL_IMAGE_DIMENSION,
      }
    : {
        uri: imageSrc ? imageSrc : fallbackImageUri,
        width: largeImageWidth,
        height: largeImageWidth ? Math.ceil(largeImageWidth / LARGE_IMAGE_ASPECT_RATIO) : undefined,
      }

  if (loading) {
    return (
      <HoliSkeleton
        height={isSmall ? SMALL_IMAGE_DIMENSION : LARGE_SKELETON_HEIGHT}
        width={'100%'}
        borderRadius={isSmall ? SMALL_OUTER_BORDER_RADIUS : LARGE_OUTER_BORDER_RADIUS}
        testID={testID + '-loading'}
      />
    )
  }

  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.mainSection}>
        <HoliLink label={label} href={href}>
          <View style={styles.blockItemInner}>
            <View style={styles.imageContainer}>
              {!imageElement ? (
                <HoliImage
                  label=""
                  source={imageSource}
                  blurhash={imageBlurhash}
                  resizeMode="cover"
                  style={styles.image}
                />
              ) : (
                imageElement
              )}
              {size === 'large' && (
                <HoliUserAvatarPile
                  users={users}
                  usersToShow={3}
                  counter
                  collapse
                  style={styles.usersPile}
                  usersTotal={totalUserCount}
                >
                  <HoliText>{totalUserCount || users.length}</HoliText>
                </HoliUserAvatarPile>
              )}
            </View>
            <View style={styles.textContainer}>
              {!!subtitle && (
                <HoliText size="extrasmall" style={styles.subtitle}>
                  {subtitle}
                </HoliText>
              )}
              <HoliText size={isSmall ? 'default' : 'small'} numberOfLines={1} style={styles.title}>
                {title}
              </HoliText>
              {!!description && (
                <HoliText size="small" numberOfLines={2} style={styles.description}>
                  {description}
                </HoliText>
              )}
              {isSmall && (
                <HoliUserAvatarPile
                  users={users}
                  usersToShow={3}
                  counter
                  collapse
                  style={styles.usersPile}
                  usersTotal={totalUserCount}
                >
                  <HoliText size="small" style={styles.usersPileText} numberOfLines={1}>
                    {t('spaces.members.member', { count: totalUserCount || users.length })}
                  </HoliText>
                </HoliUserAvatarPile>
              )}
            </View>
          </View>
        </HoliLink>
      </View>
    </View>
  )
}

export default HoliBlockItem

const stylesSmall = StyleSheet.create({
  container: {
    padding: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexGrow: 1,
  },
  mainSection: {
    flexGrow: 2,
    marginRight: 4,
  },
  blockItemInner: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  imageContainer: {
    position: 'relative',
    width: SMALL_IMAGE_DIMENSION,
    height: SMALL_IMAGE_DIMENSION,
  },
  image: {
    borderRadius: SMALL_OUTER_BORDER_RADIUS,
    height: '100%',
  },
  usersPile: {
    maxWidth: '100%',
    paddingVertical: 4,
    paddingRight: 8,
  },
  usersPileText: {
    color: colors.foreground20,
  },
  textContainer: {
    flex: 1,
    marginTop: 6,
    marginLeft: 8,
    justifyContent: 'center',
  },
  title: {},
  subtitle: {
    display: 'none',
  },
  description: {
    display: 'none',
  },
  optionsButton: {
    display: 'flex',
    padding: 8,
    borderRadius: 8,
    maxHeight: 36,
    backgroundColor: colors.background10,
  },
})

const stylesLarge = StyleSheet.create({
  container: {
    padding: 8,
    paddingBottom: 16,
    borderRadius: LARGE_OUTER_BORDER_RADIUS,
    backgroundColor: colors.background10,
  },
  mainSection: {
    flexGrow: 1,
  },
  blockItemInner: {},
  imageContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: 16,
  },
  image: {
    aspectRatio: LARGE_IMAGE_ASPECT_RATIO,
    borderRadius: 8,
    maxWidth: '100%',
  },
  usersPile: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    padding: 4,
    paddingRight: 8,
    borderRadius: 24,
    backgroundColor: colors.background10,
  },
  usersPileText: {},
  textContainer: {
    width: '100%',
  },
  title: {
    marginTop: 4,
  },
  subtitle: {
    display: 'flex',
    color: colors.foreground20,
  },
  description: {
    color: colors.foreground20,
    marginTop: 4,
  },
  optionsButton: {},
})
