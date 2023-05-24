import type { PropsWithChildren } from 'react'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { useToastForNotAvailableFeature } from '@holi/core/helpers'
import { SpaceSectionType } from '@holi/core/screens/spaces/types'
import type { User } from '@holi/core/screens/userprofile/types'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliLink from '@holi/ui/components/atoms/HoliLink'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import { colors } from '@holi/ui/styles/globalVars'

export interface HoliBlockItemProps {
  title: string
  subtitle?: string
  description?: string
  users: User[]
  imageSrc?: string
  imageElement?: React.ReactNode
  href: string
  label: string
  size?: 'small' | 'large'
  testID?: string
  type?: SpaceSectionType
  totalUserCount?: number
}

const SMALL_IMAGE_DIMENSION = 64

const HoliBlockItem = ({
  title,
  subtitle,
  description,
  users,
  imageSrc,
  imageElement,
  href,
  label,
  testID,
  type,
  size = 'small',
  totalUserCount,
}: PropsWithChildren<HoliBlockItemProps>) => {
  const { t } = useTranslation()
  const isSmall = size === 'small'
  const styles = isSmall ? stylesSmall : stylesLarge
  const imageSource = isSmall
    ? { uri: imageSrc, width: SMALL_IMAGE_DIMENSION, height: SMALL_IMAGE_DIMENSION }
    : { uri: imageSrc }

  // TODO: remove after implementing the feature
  const showFeatureNotImplementedToast = useToastForNotAvailableFeature()
  const isEditable = type === SpaceSectionType.MEMBER || type === SpaceSectionType.CREATOR

  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.mainSection}>
        <HoliLink label={label} href={href}>
          <View style={styles.blockItemInner}>
            <View style={styles.imageContainer}>
              {!imageElement ? (
                <HoliImage label="" source={imageSource} resizeMode="cover" style={styles.image} />
              ) : (
                imageElement
              )}
              {size === 'large' && (
                <HoliUserAvatarPile users={users} usersToShow={3} counter collapse style={styles.usersPile}>
                  <HoliText>{users.length}</HoliText>
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
                <HoliUserAvatarPile users={users} usersToShow={3} counter collapse style={styles.usersPile}>
                  <HoliText size="small" style={styles.usersPileText} numberOfLines={1}>
                    {t('spaces.members.member', { count: totalUserCount || users.length })}
                  </HoliText>
                </HoliUserAvatarPile>
              )}
            </View>
          </View>
        </HoliLink>
      </View>
      {isSmall && isEditable && (
        <HoliButton
          label={t('global.notAvailable')}
          inline
          transparent
          onPress={showFeatureNotImplementedToast}
          style={styles.optionsButton}
        >
          <HoliIcon icon="tools" size={20} color={colors.foreground20} />
        </HoliButton>
      )}
    </View>
  )
}

export default HoliBlockItem

const stylesSmall = StyleSheet.create({
  container: {
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
    borderRadius: 8,
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
    borderRadius: 18,
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
    aspectRatio: 240 / 160,
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
