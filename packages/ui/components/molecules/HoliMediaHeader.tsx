import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { getRelativeDateString } from '@holi/core/i18n/helpers/dateHelper'
import { User } from '@holi/core/screens/userprofile/types'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import { colors } from '@holi/ui/styles/globalVars'

export type MediaHeaderProps = {
  title: string
  author: User
  boldTitle?: boolean
  date?: string
  style?: StyleProp<ViewStyle>
  testID?: string
  isPublic?: boolean
}

const HoliMediaHeader: React.VFC<MediaHeaderProps> = ({ title, author, boldTitle, date, style, testID, isPublic }) => {
  const { t, i18n } = useTranslation()

  const formattedDate = useMemo(() => {
    if (!date) return undefined
    const dateString = getRelativeDateString(date, i18n.language)
    return dateString.charAt(0).toUpperCase() + dateString.slice(1)
  }, [date, i18n.language])

  const authorName = author.fullName || t('user.profileView.anonymous')

  return (
    <View style={[styles.row, style]} testID={testID}>
      <HoliAvatar
        imageSrc={author.avatar}
        label={authorName}
        initials={author.avatarLabel || ''}
        defaultColor={author.avatarDefaultColor || ''}
        size="small"
      />

      <View style={[styles.titleContainer]}>
        <HoliText bold={boldTitle}>{title}</HoliText>
        <View style={styles.row}>
          {!!formattedDate && (
            <HoliText size="small" style={styles.subline}>
              {formattedDate}
            </HoliText>
          )}
          {!!formattedDate && isPublic !== undefined && <HoliText style={styles.subline}>𐤟</HoliText>}
          {isPublic !== undefined &&
            (isPublic ? (
              <>
                <HoliIcon icon={'global'} size={14} filled={true} style={styles.subline} />
                <HoliText size="small" style={styles.subline}>
                  {t('spaces.updates.filter.public')}
                </HoliText>
              </>
            ) : (
              <>
                <HoliIcon icon={'lock'} size={14} filled={true} style={styles.subline} />
                <HoliText size="small" style={styles.subline}>
                  {t('spaces.updates.filter.members')}
                </HoliText>
              </>
            ))}
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
    flex: 1,
  },
  subline: {
    marginTop: 4,
    marginRight: 4,
    color: colors.foreground20,
  },
})

export default HoliMediaHeader
