import { type i18n } from 'i18next'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { getRelativeDateString } from '@holi/core/i18n/helpers/dateHelper'
import { User } from '@holi/core/screens/userprofile/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar, { AvatarSize } from '@holi/ui/components/molecules/HoliAvatar'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

interface BaseProps {
  style?: StyleProp<ViewStyle>
  testID?: string
}
interface SkeletonProps extends BaseProps {
  loading: true
  author?: User
  title?: string
  date?: string
  boldTitle?: boolean
  avatarSize?: AvatarSize
}
interface HoliMediaHeaderProps extends BaseProps {
  loading?: false
  title: string
  author: User
  boldTitle?: boolean
  date?: string
  avatarSize?: AvatarSize
}
type Props = SkeletonProps | HoliMediaHeaderProps

export const getFormattedDate = (date: string | undefined, i18n: i18n) => {
  if (!date) return undefined
  const dateString = getRelativeDateString(date, i18n.language)
  return dateString.charAt(0).toUpperCase() + dateString.slice(1)
}

const HoliMediaHeader = ({ loading, title, author, boldTitle, date, avatarSize, style, testID }: Props) => {
  const { t, i18n } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  /*
    converting given timestamp to a date first (with '00:00:00' as time)
    to show the real days instead of exact timestamp calculations
  */
  const formattedDate = date ? getFormattedDate(new Date(date).toDateString(), i18n) : undefined

  const authorName = author?.fullName || t('user.profileView.anonymous')

  if (loading) {
    return (
      <View style={[styles.row, style]} testID={testID}>
        <HoliAvatar
          imageSrc={author?.avatar || ''}
          imageBlurhash={author?.avatarBlurhash || ''}
          label={authorName}
          initials={author?.avatarLabel || ''}
          defaultColor={author?.avatarDefaultColor || ''}
          size={avatarSize || 'small'}
          loading
        />

        <View style={[styles.titleContainer]}>
          <HoliText bold={!!boldTitle} loading>
            {title}
          </HoliText>
          <HoliText size="small" style={styles.date} loading />
        </View>
      </View>
    )
  }

  return (
    <View style={[styles.row, style]} testID={testID}>
      <HoliAvatar
        imageSrc={author?.avatar ?? ''}
        imageBlurhash={author?.avatarBlurhash ?? ''}
        label={authorName}
        initials={author?.avatarLabel ?? ''}
        defaultColor={author?.avatarDefaultColor ?? ''}
        size={avatarSize || 'small'}
      />

      <View style={[styles.titleContainer]}>
        <HoliText bold={boldTitle}>{title}</HoliText>
        <View style={styles.row}>
          {!!formattedDate && (
            <HoliText size="small" style={styles.date}>
              {formattedDate}
            </HoliText>
          )}
        </View>
      </View>
    </View>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
    },
    titleContainer: {
      flexDirection: 'column',
      marginHorizontal: 16,
      flex: 1,
    },
    date: {
      marginTop: 4,
      color: theme.colors.foreground20,
    },
  })

export default HoliMediaHeader
