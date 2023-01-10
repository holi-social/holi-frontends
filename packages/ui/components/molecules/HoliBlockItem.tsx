import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { ImageSourcePropType, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { User } from '@holi/core/screens/userprofile/types'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliLink from '@holi/ui/components/molecules/HoliLink'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import { colors } from '@holi/ui/styles/globalVars'

export type HoliBlockItemProps = {
  title: string
  subtitle?: string
  description?: string
  users: User[]
  imageSrc: string
  href: string
  label: string
  size?: 'small' | 'large'
  style?: StyleProp<ViewStyle>
  testID?: string
}

const HoliBlockItem: React.VFC<HoliBlockItemProps> = ({
  title,
  subtitle,
  description,
  users,
  imageSrc,
  href,
  label,
  size = 'small',
  style,
  testID,
}) => {
  const { t } = useTranslation()
  const imageUri: ImageSourcePropType = { uri: imageSrc }
  const styles = size === 'small' ? stylesSmall : stylesLarge

  return (
    <HoliLink
      label={label}
      href={href}
      style={[styles.holiBlockItem, style]}
      textStyle={styles.holiBlockItemInner}
      testID={testID}
    >
      <View style={[styles.imageContainer]}>
        <HoliImage label="" source={imageUri} resizeMode="cover" style={styles.image} />
        {size === 'large' && (
          <HoliUserAvatarPile users={users} usersToShow={3} counter collapse style={styles.usersPile}>
            <HoliText>{users.length}</HoliText>
          </HoliUserAvatarPile>
        )}
      </View>
      <View style={styles.textContainer}>
        {subtitle && (
          <HoliText size="extrasmall" style={styles.subtitle}>
            {subtitle}
          </HoliText>
        )}
        <HoliText size={size === 'small' ? 'default' : 'small'} numberOfLines={1} style={styles.title}>
          {title}
        </HoliText>
        {description && (
          <HoliText size="small" numberOfLines={2} style={styles.description}>
            {description}
          </HoliText>
        )}
        {size === 'small' && (
          <HoliUserAvatarPile users={users} usersToShow={3} counter collapse style={styles.usersPile}>
            <HoliText size="small" style={styles.usersPileText} numberOfLines={1}>
              {t('spaces.members.member', { count: users.length })}
            </HoliText>
          </HoliUserAvatarPile>
        )}
      </View>
    </HoliLink>
  )
}

export default HoliBlockItem

const stylesSmall = StyleSheet.create({
  holiBlockItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  holiBlockItemInner: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  imageContainer: {
    position: 'relative',
    width: 64,
    height: 64,
  },
  image: {
    borderRadius: 8,
    height: '100%',
  },
  usersPile: {
    maxWidth: '100%',
    padding: 4,
    paddingRight: 8,
  },
  usersPileText: {
    color: colors.fontColorGrey,
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
})

const stylesLarge = StyleSheet.create({
  holiBlockItem: {
    padding: 8,
    paddingBottom: 16,
    borderRadius: 18,
  },
  holiBlockItemInner: {},
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
    backgroundColor: colors.backgroundColor,
  },
  usersPileText: {},
  textContainer: {},
  title: {
    marginTop: 4,
  },
  subtitle: {
    display: 'flex',
    color: colors.fontColorGrey,
  },
  description: {
    color: colors.fontColorGrey,
    marginTop: 4,
  },
})
