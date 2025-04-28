import type { PropsWithChildren } from 'react'
import type * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, View } from 'react-native'

import type { User } from '@holi/core/domain/shared/types'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import type { PropsWithSkeleton } from '@holi/ui/components/types'
import Spacing from '@holi/ui/foundations/Spacing'
import { createStyleSheet } from 'holi-bricks/styles'
import { useStyles } from 'holi-bricks/styles'

interface Props {
  title: string
  subtitle?: string
  description?: string
  users?: User[]
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
}: PropsWithChildren<PropsWithSkeleton<Props>>) => {
  const { t } = useTranslation()
  const isSmall = size === 'small'
  const { styles } = useStyles(isSmall ? getStylesSmall : getStylesLarge)

  const largeImageWidth = cardWidthForImageScaling ? cardWidthForImageScaling - 2 * styles.container.padding : undefined
  const imageSource = isSmall
    ? {
        uri: imageSrc,
        width: SMALL_IMAGE_DIMENSION,
        height: SMALL_IMAGE_DIMENSION,
      }
    : {
        uri: imageSrc,
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
                  label={title}
                  source={imageSource}
                  blurhash={imageBlurhash}
                  resizeMode="cover"
                  style={styles.image}
                />
              ) : (
                imageElement
              )}
              {size === 'large' && users && (
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
              {isSmall && users && (
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

const getStylesSmall = createStyleSheet((theme) => ({
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
    marginRight: Spacing['4xs'],
  },
  blockItemInner: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: Spacing.xs,
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
    paddingVertical: Spacing['4xs'],
    paddingRight: Spacing['3xs'],
  },
  usersPileText: {
    color: theme.colors.fill.support,
  },
  textContainer: {
    flex: 1,
    marginTop: 6,
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
    padding: Spacing['3xs'],
    borderRadius: Spacing['3xs'],
    maxHeight: 36,
    backgroundColor: theme.colors.bg.support,
  },
}))

const getStylesLarge = createStyleSheet((theme) => ({
  container: {
    padding: Spacing['3xs'],
    paddingBottom: Spacing.xs,
    borderRadius: LARGE_OUTER_BORDER_RADIUS,
    borderWidth: 1,
    backgroundColor: theme.colors.bg.support,
    borderColor: theme.colors.border.default,
    flex: 1,
  },
  mainSection: {
    flexGrow: 1,
  },
  blockItemInner: {},
  imageContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: Spacing.xs,
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
    padding: Spacing['4xs'],
    paddingRight: Spacing['3xs'],
    borderRadius: Spacing.md,
    backgroundColor: theme.colors.bg.support,
  },
  usersPileText: {},
  textContainer: {
    width: '100%',
  },
  title: {
    marginTop: Spacing['4xs'],
  },
  subtitle: {
    display: 'flex',
    color: theme.colors.fill.support,
  },
  description: {
    color: theme.colors.fill.support,
    marginTop: Spacing['4xs'],
  },
  optionsButton: {},
}))
