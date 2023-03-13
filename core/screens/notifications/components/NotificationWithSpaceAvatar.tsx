import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { ImageSourcePropType, StyleSheet, View } from 'react-native'

import { getRelativeDateString } from '@holi/core/i18n/helpers/dateHelper'
import NotificationBadge from '@holi/core/navigation/components/NotificationBadge'
import { NotificationProps, NotificationSpaceConnection } from '@holi/core/screens/notifications/components/types'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliLink from '@holi/ui/components/atoms/HoliLink'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

interface NotificationWithSpaceAvatarProps<T = NotificationSpaceConnection> extends NotificationProps<T> {
  href?: string
  content?: React.ReactNode
  i18nKey?: string
}

const NotificationWithSpaceAvatar = ({
  notification,
  content,
  children,
  href,
  i18nKey,
  style,
  testID = '',
}: React.PropsWithChildren<NotificationWithSpaceAvatarProps>) => {
  const { t, i18n } = useTranslation()
  const { created, read } = notification
  const { fullName } = notification.options.user
  const { name: spaceIdOrName, title, avatar } = notification.options.space
  href = href || `/spaces/${spaceIdOrName}`
  const imageUri: ImageSourcePropType = { uri: avatar }

  return (
    <View style={style} testID={testID}>
      <HoliLink href={href} label={title} mobileNavigateBackFirst>
        <View style={styles.link}>
          <View style={styles.imageContainer}>
            <HoliImage label="" source={imageUri} resizeMode="cover" style={styles.image} />
          </View>
          <View style={styles.content}>
            {content || (
              <>
                <HoliText size="small" style={styles.fontColorGray}>
                  <Trans t={t} i18nKey={i18nKey} values={{ user: fullName, space: title }}>
                    <HoliText size="small" />
                  </Trans>
                </HoliText>

                <HoliText size="extrasmall" style={[styles.fontColorGray, styles.createdDate]}>
                  {getRelativeDateString(created, i18n.language)}
                </HoliText>
              </>
            )}
          </View>

          <NotificationBadge visible={!read} backgroundColor={colors.background30} style={styles.readStatus} />
        </View>
      </HoliLink>

      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  link: {
    display: 'flex',
    flexDirection: 'row',
  },
  content: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '100%',
    marginLeft: 12,
  },
  fontColorGray: {
    color: colors.foreground20,
  },
  createdDate: {
    marginTop: 4,
  },
  readStatus: {
    marginLeft: 12,
  },
  imageContainer: {
    position: 'relative',
    width: 40,
    height: 40,
  },
  image: {
    borderRadius: 8,
    height: '100%',
  },
})

export default NotificationWithSpaceAvatar
