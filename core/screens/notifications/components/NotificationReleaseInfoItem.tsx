import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { getRelativeDateString } from '@holi/core/i18n/helpers/dateHelper'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import NotificationBellBadge from '@holi/core/navigation/components/header/NotificationBellBadge'
import { NotificationProps, NotificationReleaseInfo } from '@holi/core/screens/notifications/components/types'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

const NotificationReleaseInfoItem: React.FC<NotificationProps<NotificationReleaseInfo>> = ({
  notification,
  style,
  testID = '',
}) => {
  const { t, i18n } = useTranslation()
  const { created, read } = notification
  const { post } = notification.options
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  return (
    <View style={style} testID={testID}>
      <HoliLink href={`/posts/${post?.id}`} label={post?.title}>
        <View style={styles.link}>
          <HoliLocalImage
            imageSource={require('@holi/ui/assets/img/holi/holi_brandmark.svg')}
            label=""
            width={styles.avatar.width}
            height={styles.avatar.height}
            resizeMode="contain"
            isSvg
          />

          <View style={styles.content}>
            <HoliText size="small" style={styles.fontColorGray}>
              {t('notifications.releaseinfo.message')}
            </HoliText>

            <HoliText size="extrasmall" style={[styles.fontColorGray, styles.createdDate]}>
              {getRelativeDateString(created, i18n.language)}
            </HoliText>
          </View>

          <NotificationBellBadge visible={!read} backgroundColor={colors.background30} style={styles.readStatus} />
        </View>
      </HoliLink>
    </View>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    link: {
      display: 'flex',
      flexDirection: 'row',
    },
    avatar: {
      height: 40,
      width: 40,
    },
    content: {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: '100%',
      marginLeft: 12,
    },
    fontColorGray: {
      color: theme.colors.foreground20,
    },
    createdDate: {
      marginTop: 4,
    },
    readStatus: {
      marginLeft: 12,
    },
  })

export default NotificationReleaseInfoItem
