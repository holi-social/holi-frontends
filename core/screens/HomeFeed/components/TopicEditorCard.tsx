import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, ViewStyle } from 'react-native'

import { User } from '@holi/core/screens/userprofile/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliChip from '@holi/ui/components/molecules/HoliChip'
import HoliUserAvatar from '@holi/ui/components/molecules/HoliUserAvatar'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type TopicEditorCardProps = {
  user: User
  category: string
  style?: (ViewStyle | Record<string, unknown> | undefined) | (ViewStyle | Record<string, unknown> | undefined)[]
}

const TopicEditorCard: React.FunctionComponent<TopicEditorCardProps> = ({
  user,
  category,
  style,
}: TopicEditorCardProps) => {
  const { theme } = useTheme()
  const styles = getStyles(theme)
  const { t } = useTranslation()

  if (!user) {
    return <View style={[styles.container, style]}></View>
  }

  const nameLabel = `${user.firstName || ''} ${user.lastName || ''}`.trim()
  return (
    <View style={[styles.container, style]} accessible>
      <HoliUserAvatar
        imageSrc={user.avatar}
        nameLabel={nameLabel === '' ? t('navigation.headerRight.avatarFallbackLabel') : nameLabel}
        initials={user.avatarLabel}
        defaultColor={user.avatarDefaultColor}
        size="extralarge"
      ></HoliUserAvatar>
      <HoliText style={styles.textStyle} bold>
        {nameLabel}
      </HoliText>
      <HoliChip style={styles.chip} text={category} checked hideIcon disabled></HoliChip>
      <View style={styles.textStyleAboutMe}>
        <HoliText style={styles.textStyle}>{user.aboutMe}</HoliText>
      </View>
    </View>
  )
}

export default TopicEditorCard

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
