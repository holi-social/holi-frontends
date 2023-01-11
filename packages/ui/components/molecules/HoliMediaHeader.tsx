import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { getRelativeDateString } from '@holi/core/i18n/helpers/dateHelper'
import { User } from '@holi/core/screens/userprofile/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliLink from '@holi/ui/components/molecules/HoliLink'
import HoliUserAvatar from '@holi/ui/components/molecules/HoliUserAvatar'
import { colors } from '@holi/ui/styles/globalVars'

export type MediaHeaderProps = {
  title: string
  author: User
  boldTitle?: boolean
  date?: string
  onPress?: () => void
  href?: boolean | string
  style?: StyleProp<ViewStyle>
  testID?: string
}

const HoliMediaHeader: React.FC<MediaHeaderProps> = ({
  title,
  author,
  boldTitle,
  date,
  onPress,
  href,
  style,
  children,
  testID,
}) => {
  const { t, i18n } = useTranslation()

  const formattedDate = useMemo(() => {
    if (!date) return undefined
    const dateString = getRelativeDateString(date, i18n.language)
    return dateString.charAt(0).toUpperCase() + dateString.slice(1)
  }, [date, i18n.language])

  const authorName = author.fullName || t('user.profileView.anonymous')

  const titleContent = (
    <View style={styles.titleContainer}>
      <HoliText bold={boldTitle}>{title}</HoliText>
      {formattedDate && (
        <HoliText size="small" style={styles.date}>
          {formattedDate}
        </HoliText>
      )}
    </View>
  )

  return (
    <View style={[styles.header, style]}>
      <HoliUserAvatar
        imageSrc={author.avatar}
        label={authorName}
        initials={author.avatarLabel || ''}
        defaultColor={author.avatarDefaultColor || ''}
        size="small"
      />

      {href ? (
        <HoliLink
          href={typeof href === 'string' ? href : `/profile/${author.id}`}
          label={title}
          onPress={onPress}
          testID={testID || 'btn-media-header'}
          style={styles.titlePressable}
        >
          {titleContent}
        </HoliLink>
      ) : (
        <HoliButton
          transparent
          label={title}
          onPress={onPress}
          testID={testID || 'btn-media-header'}
          contentStyle={styles.titlePressable}
        >
          {titleContent}
        </HoliButton>
      )}

      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contentContainer: {
    flexDirection: 'row',
  },
  titlePressable: {
    flexGrow: 1,
    flexShrink: 1,
  },
  titleContainer: {
    flexDirection: 'column',
    marginHorizontal: 16,
  },
  date: {
    marginTop: 4,
    color: colors.fontColorGrey,
  },
})

export default HoliMediaHeader
