import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { userFullName } from '@holi/core/helpers'
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
  testID?: string
}

const HoliMediaHeader: React.FC<MediaHeaderProps> = ({
  title,
  author,
  boldTitle,
  date,
  touchHandler,
  style,
  children,
  testID,
}) => {
  const { i18n } = useTranslation()

  const formattedDate = useMemo(() => {
    if (!date) return undefined
    const dateString = getRelativeDateString(date, i18n.language)
    return dateString.charAt(0).toUpperCase() + dateString.slice(1)
  }, [date, i18n.language])

  const authorName = author.name || userFullName(author)

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
        <HoliButton transparent label={title} onPress={touchHandler} testID={testID || 'btn-media-header'}>
          <HoliText bold={boldTitle}>{title}</HoliText>
          {formattedDate && (
            <HoliText size="small" style={styles.date}>
              {formattedDate}
            </HoliText>
          )}
        </HoliButton>
      </View>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
