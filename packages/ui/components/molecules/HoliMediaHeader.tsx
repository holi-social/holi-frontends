import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { fullName } from '@holi/core/helpers'
import { getRelativeDateString } from '@holi/core/i18n/helpers/dateHelper'
import { User } from '@holi/core/screens/userprofile/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliUserAvatar from '@holi/ui/components/molecules/HoliUserAvatar'
import { colors } from '@holi/ui/styles/globalVars'

export type MediaHeaderProps = {
  title: string
  author: Partial<User & { name: string }>
  boldTitle?: boolean
  date?: string
  touchHandler?: () => void
  style?: StyleProp<ViewStyle>
  children?: React.ReactNode
}

const HoliMediaHeader: React.VFC<MediaHeaderProps> = ({
  title,
  author,
  boldTitle,
  date,
  touchHandler,
  style,
  children,
}) => {
  const { i18n } = useTranslation()

  const formattedDate = useMemo(() => {
    if (!date) return undefined
    const dateString = getRelativeDateString(date, i18n.language)
    return dateString.charAt(0).toUpperCase() + dateString.slice(1)
  }, [date, i18n.language])

  const authorName = author.name || fullName(author.firstName, author.lastName)

  return (
    <View style={[styles.header, style]}>
      <HoliUserAvatar
        imageSrc={author.avatar}
        label={authorName}
        initials={author.avatarLabel || ''}
        defaultColor={author.avatarDefaultColor || ''}
        size="small"
      />
      <View style={styles.titleContainer}>
        <HoliButton transparent label={title} onPress={touchHandler}>
          <HoliText bold={boldTitle}>{title}</HoliText>
        </HoliButton>
        {formattedDate && (
          <HoliText size="small" style={styles.date}>
            {formattedDate}
          </HoliText>
        )}
      </View>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  titleContainer: {
    marginHorizontal: 16,
    flex: 1,
  },
  date: {
    marginTop: 4,
    color: colors.fontColorGrey,
  },
})

export default HoliMediaHeader
