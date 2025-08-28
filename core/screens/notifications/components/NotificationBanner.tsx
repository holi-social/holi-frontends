import type React from 'react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type StyleProp, View, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import type { User } from '@holi/core/domain/shared/types'
import i18n from '@holi/core/i18n'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Check, Close } from '@holi/icons/src/generated'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { Avatar } from 'holi-bricks/components/avatar'
import { ButtonIcon } from 'holi-bricks/components/button'

interface NotificationBannerProps {
  member?: User
  spaceName: string
  status: 'accepted' | 'cancelled' | 'deleted'
  showBanner: boolean
  style?: StyleProp<ViewStyle>
}

const NotificationBanner = ({
  style,
  spaceName,
  status,
  member,
  showBanner = true,
}: React.PropsWithChildren<NotificationBannerProps>) => {
  const { t } = useTranslation()
  const [isVisible, setIsVisible] = useState(showBanner)
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  const formatUsername = (username: string, locale: string) => {
    if (locale === 'de-DE' || locale === 'de') {
      if (
        username.endsWith('s') ||
        username.endsWith('ss') ||
        username.endsWith('ß') ||
        username.endsWith('tz') ||
        username.endsWith('z') ||
        username.endsWith('x')
      ) {
        return username + "'"
      } else {
        return username + 's'
      }
    } else if (locale === 'en-US' || locale === 'en') {
      if (username.endsWith('s') || username.endsWith('z')) {
        return username + "'"
      } else {
        return username + "'s"
      }
    } else {
      return username
    }
  }

  const statusList = [
    {
      status: 'accepted',
      iconColor: colors.brandColorC20,
      message: t('notifications.banner.accept', {
        space: spaceName,
      }),
    },
    {
      status: 'cancelled',
      iconColor: colors.warning20,
      message: t('notifications.banner.cancelled', {
        space: spaceName,
      }),
    },
    {
      status: 'deleted',
      iconColor: colors.warning20,
      message: t('notifications.banner.deleted', {
        space: spaceName,
      }),
    },
  ]

  const matchingStatus = statusList.find((item) => item.status === status)

  return (
    <>
      {isVisible && (
        <View style={[style, styles.container]}>
          <View>
            {status === 'deleted' ? (
              <HoliLocalImage
                imageSource={require('@holi/ui/assets/img/notifications/avatar.svg')}
                width={40}
                height={40}
                label={t('user.profileForm.avatar')}
                isSvg={true}
                resizeMode="contain"
              />
            ) : (
              <Avatar
                source={member?.avatar}
                size="sm"
                label={t('user.profileForm.avatar')}
                imgPlaceholder={member?.avatarBlurhash}
                initials={member?.avatarLabel || ''}
              />
            )}
            {matchingStatus &&
              (matchingStatus.status === 'accepted' ? (
                <View style={[styles.iconContainer, { backgroundColor: matchingStatus.iconColor }]}>
                  <HoliIcon icon={Check} size={12} />
                </View>
              ) : (
                <View style={[styles.iconContainer, { backgroundColor: matchingStatus.iconColor }]}>
                  <HoliLocalImage
                    imageSource={require('@holi/ui/assets/img/notifications/warning.svg')}
                    width={12}
                    height={12}
                    label={t('user.profileForm.avatar')}
                    isSvg={true}
                    resizeMode="contain"
                  />
                </View>
              ))}
          </View>
          <View style={styles.content}>
            <HoliText size="small" style={styles.message}>
              {member && (
                <HoliText size="small" bold>
                  {status !== 'deleted' &&
                    status !== 'cancelled' &&
                    formatUsername(member?.fullName ?? '', i18n.language)}
                  {status === 'cancelled' && member?.fullName}
                </HoliText>
              )}
              {matchingStatus && matchingStatus.message}
            </HoliText>
          </View>
          <View style={styles.status}>
            <ButtonIcon label={''} transparent onPress={() => setIsVisible(false)} icon={Close} />
          </View>
        </View>
      )}
    </>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 12,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.background30,
      backgroundColor: theme.colors.background10,
    },
    content: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      marginHorizontal: 12,
    },

    iconContainer: {
      width: 18,
      height: 18,
      backgroundColor: theme.colors.brandColorC30,
      position: 'absolute',
      bottom: 0,
      right: 0,
      zIndex: 1,
      borderWidth: 1,

      borderRadius: 999,

      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    status: {
      display: 'flex',
      width: 40,
      height: 40,
      justifyContent: 'flex-start',
      alignItems: 'center',
      gap: 10,
      flexShrink: 0,
    },
    message: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 4,
    },
  })

export default NotificationBanner
