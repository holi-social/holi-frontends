import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { getRelativeDateString } from '@holi/core/i18n/helpers/dateHelper'
import { User } from '@holi/core/screens/userprofile/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import { colors } from '@holi/ui/styles/globalVars'

interface BaseProps {
  style?: StyleProp<ViewStyle>
  testID?: string
}
interface SkeletonProps extends BaseProps {
  loading: true
  author?: User
}
interface HoliMediaHeaderProps extends BaseProps {
  loading?: false
  title: string
  author: User
  boldTitle?: boolean
  date?: string
}
type Props = SkeletonProps | HoliMediaHeaderProps

const HoliMediaHeader = ({ loading, title, author, boldTitle, date, style, testID }: Props) => {
  const { t, i18n } = useTranslation()

  const authorName = author?.fullName || t('user.profileView.anonymous')

  const formattedDate = useMemo(() => {
    if (!date) return undefined
    const dateString = getRelativeDateString(date, i18n.language)
    return dateString.charAt(0).toUpperCase() + dateString.slice(1)
  }, [date, i18n.language])

  if (loading) {
    return (
      <View style={[styles.row, style]} testID={testID}>
        <HoliAvatar
          imageSrc={author?.avatar || ''}
          imageBlurhash={author?.avatarBlurhash || ''}
          label={authorName}
          initials={author?.avatarLabel || ''}
          defaultColor={author?.avatarDefaultColor || ''}
          size="small"
          loading
        />

        <View style={[styles.titleContainer]}>
          <HoliText bold={boldTitle} loading>
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
        imageSrc={author.avatar}
        imageBlurhash={author.avatarBlurhash}
        label={authorName}
        initials={author.avatarLabel || ''}
        defaultColor={author.avatarDefaultColor || ''}
        size="small"
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

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  titleContainer: {
    flexDirection: 'column',
    marginHorizontal: 16,
    marginBottom: 16,
    flex: 1,
  },
  date: {
    marginTop: 4,
    color: colors.foreground20,
  },
  visibility: {
    marginRight: 4,
    marginBottom: 16,
  },
})

export default HoliMediaHeader
