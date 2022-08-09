import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { User } from '@holi/core/screens/userprofile/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliChip from '@holi/ui/components/molecules/HoliChip'
import HoliUserAvatar from '@holi/ui/components/molecules/HoliUserAvatar'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type HoliUserCardProps = {
  user: User
  category?: string
  style?: StyleProp<ViewStyle>
}

const HoliUserCard: React.FunctionComponent<HoliUserCardProps> = ({ user, category, style }: HoliUserCardProps) => {
  const { theme } = useTheme()
  const styles = getStyles(theme)
  const { t } = useTranslation()

  if (!user) {
    return <View style={[styles.container, style]}></View>
  }

  const { firstName, lastName, avatar, avatarLabel, avatarDefaultColor, aboutMe } = user

  const nameLabel = `${firstName || ''} ${lastName || ''}`.trim()
  return (
    <View style={[styles.container, style]} accessible testID="user-card">
      <HoliUserAvatar
        imageSrc={avatar}
        nameLabel={nameLabel === '' ? t('navigation.headerRight.avatarFallbackLabel') : nameLabel}
        initials={avatarLabel}
        defaultColor={avatarDefaultColor}
        size="extralarge"
      />
      <HoliText style={styles.textStyle} bold>
        {nameLabel}
      </HoliText>
      {category && <HoliChip style={styles.chip} text={category} checked hideIcon disabled />}
      <View style={styles.textStyleAboutMe}>
        <HoliText style={styles.textStyle}>{aboutMe}</HoliText>
      </View>
    </View>
  )
}

export default HoliUserCard

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      alignItems: 'center',
      alignContent: 'center',
      backgroundColor: theme.colors.softwhite,
      padding: 24,
      borderRadius: 16,
    },
    chip: {
      marginVertical: 8,
      alignSelf: 'center',
    },
    textStyle: {
      marginTop: 8,
      textAlign: 'center',
    },
    textStyleAboutMe: {
      justifyContent: 'center',
    },
  })
