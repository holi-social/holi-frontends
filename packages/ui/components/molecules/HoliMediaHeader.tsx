import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { getRelativeDateString } from '@holi/core/i18n/helpers/dateHelper'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliUserAvatar from '@holi/ui/components/molecules/HoliUserAvatar'
import { colors } from '@holi/ui/styles/globalVars'

export type MediaHeaderProps = {
  title: string
  author: {
    name: string
    avatarLabel?: string
    avatarDefaultColor?: string
    avatar?: string
  }
  date?: string
  touchHandler?: () => void
  style?: StyleProp<ViewStyle>
  children?: React.ReactNode
}

const HoliMediaHeader: React.VFC<MediaHeaderProps> = ({ title, author, date, touchHandler, children }) => {
  const { i18n } = useTranslation()

  const formattedDate = useMemo(() => {
    if (!date) return undefined
    const dateString = getRelativeDateString(date, i18n.language)
    return dateString.charAt(0).toUpperCase() + dateString.slice(1)
  }, [date, i18n.language])

  return (
    <View style={styles.header}>
      <HoliUserAvatar
        imageSrc={author.avatar}
        label={author.name}
        initials={author.avatarLabel || ''}
        defaultColor={author.avatarDefaultColor || ''}
        size="small"
      />
      <View style={styles.titleContainer}>
        <HoliButton transparent label={title} onPress={touchHandler}>
          <HoliText>{title}</HoliText>
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
